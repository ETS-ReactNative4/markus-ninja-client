import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import moment from 'moment'
import Dialog from 'components/Dialog'
import HTML from 'components/HTML'
import RichTextEditor from 'components/RichTextEditor'
import UserLink from 'components/UserLink'
import DeleteLessonCommentMutation from 'mutations/DeleteLessonCommentMutation'
import UpdateLessonCommentMutation from 'mutations/UpdateLessonCommentMutation'
import {get, isNil, timeDifferenceForDate} from 'utils'

class LessonComment extends React.Component {
  state = {
    confirmDeleteDialogOpen: false,
    edit: false,
    error: null,
    body: get(this.props, "comment.body", ""),
  }

  handleChange = (body) => {
    this.setState({body})
  }

  handleDelete = () => {
    DeleteLessonCommentMutation(
      this.props.comment.id,
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { body } = this.state
    UpdateLessonCommentMutation(
      this.props.comment.id,
      body,
      (lessonComment, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
        }
        this.setState({body: lessonComment.body})
        this.handleToggleEdit()
      },
    )
  }

  handleToggleDeleteConfirmation = () => {
    const {confirmDeleteDialogOpen} = this.state
    this.setState({
      confirmDeleteDialogOpen: !confirmDeleteDialogOpen,
    })
  }

  handleToggleEdit = () => {
    this.setState({
      body: get(this.props, "comment.body", ""),
      edit: !this.state.edit,
    })
  }

  get classes() {
    const {className} = this.props
    return cls("LessonComment", className)
  }

  render() {
    const comment = get(this.props, "comment", {})
    const {edit} = this.state

    return (
      <div className={this.classes}>
        {edit && comment.viewerCanUpdate
        ? this.renderForm()
        : this.renderComment()}
      </div>
    )
  }

  renderComment() {
    const comment = get(this.props, "comment", {})

    return (
      <div
        id={`lesson_comment${moment(comment.createdAt).unix()}`}
        className="mdc-card mdc-card--outlined"
      >
        <div className="mdc-typography--subtitle2 mdc-theme--text-secondary-on-light pa3">
          <UserLink className="rn-link rn-link--secondary" user={get(comment, "author", null)} />
          <span className="ml1">commented {timeDifferenceForDate(comment.createdAt)}</span>
        </div>
        <HTML className="ph3" html={comment.bodyHTML} />
        {comment.viewerCanUpdate &&
        <div className="mdc-card__actions">
          <div className="mdc-card__action-buttons">
            {comment.viewerDidAuthor &&
            <button
              className="mdc-button mdc-button--outlined mdc-card__action mdc-card__action--button"
              disabled
            >
              Author
            </button>}
          </div>
          <div className="mdc-card__action-icons">
            {comment.viewerCanDelete &&
            <button
              className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
              type="button"
              onClick={this.handleToggleDeleteConfirmation}
              aria-label="Delete comment"
              title="Delete comment"
            >
              delete
            </button>}
            {comment.viewerCanUpdate &&
            <button
              className="material-icons mdc-icon-button mdc-card__action--icon"
              type="button"
              onClick={this.handleToggleEdit}
              aria-label="Edit comment"
              title="Edit comment"
            >
              edit
            </button>}
          </div>
        </div>}
        {comment.viewerCanDelete && this.renderConfirmDeleteDialog()}
      </div>
    )
  }

  renderConfirmDeleteDialog() {
    const {confirmDeleteDialogOpen} = this.state

    return (
      <Dialog
        open={confirmDeleteDialogOpen}
        onClose={() => this.setState({confirmDeleteDialogOpen: false})}
        title={<Dialog.Title>Delete comment</Dialog.Title>}
        content={
          <Dialog.Content>
            <div className="flex flex-column mw5">
              <p>Are you sure?</p>
            </div>
          </Dialog.Content>
        }
        actions={
          <Dialog.Actions>
            <button
              type="button"
              className="mdc-button"
              data-mdc-dialog-action="no"
            >
              No
            </button>
            <button
              type="button"
              className="mdc-button"
              onClick={this.handleDelete}
              data-mdc-dialog-action="yes"
            >
              Yes
            </button>
          </Dialog.Actions>}
        />
    )
  }
  renderForm() {
    const study = get (this.props, "comment.study", null)
    const {body} = this.state

    return (
      <form>
        <RichTextEditor
          id="LessonComment__body"
          placeholder="Leave a comment"
          initialValue={body}
          submitText="Update comment"
          study={study}
          onCancel={this.handleToggleEdit}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
        />
      </form>
    )
  }
}

export default createFragmentContainer(LessonComment, graphql`
  fragment LessonComment_comment on LessonComment {
    author {
      ...UserLink_user
    }
    createdAt
    body
    bodyHTML
    id
    publishedAt
    study {
      ...RichTextEditor_study
    }
    updatedAt
    viewerCanDelete
    viewerCanUpdate
    viewerDidAuthor
  }
`)
