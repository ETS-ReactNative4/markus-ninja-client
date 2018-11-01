import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import moment from 'moment'
import Dialog from 'components/Dialog'
import HTML from 'components/HTML'
import StudyBodyEditor from 'components/StudyBodyEditor'
import UserLink from 'components/UserLink'
import DeleteLessonCommentMutation from 'mutations/DeleteLessonCommentMutation'
import PublishLessonCommentDraftMutation from 'mutations/PublishLessonCommentDraftMutation'
import UpdateLessonCommentMutation from 'mutations/UpdateLessonCommentMutation'
import {debounce, get, isNil, throttle, timeDifferenceForDate} from 'utils'

class LessonComment extends React.Component {
  state = {
    confirmDeleteDialogOpen: false,
    edit: false,
    error: null,
    draft: {
      dirty: false,
      initialValue: get(this.props, "comment.draft", ""),
      value: get(this.props, "comment.draft", ""),
    }
  }

  autoSaveOnChange = throttle(
    debounce(() => this.updateDraft(this.state.draft.value), 30000)
  , 30000)

  updateDraft = (draft) => {
    UpdateLessonCommentMutation(
      this.props.comment.id,
      draft,
      (comment, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
        }
        this.setState({
          draft: {
            ...this.state.draft,
            dirty: false,
            value: comment.draft
          }
        })
      },
    )
  }

  handleCancel = () => {
    const {initialValue} = this.state
    this.updateDraft(initialValue)
    this.handleToggleEdit()
  }

  handleChange = (value) => {
    const {draft} = this.state
    const dirty = value !== draft.value
    this.setState({
      draft: {
        dirty,
        value,
      },
    })
    if (dirty) {
      this.autoSaveOnChange()
    }
  }

  handleDelete = () => {
    DeleteLessonCommentMutation(
      this.props.comment.id,
    )
  }

  handlePublish = () => {
    PublishLessonCommentDraftMutation(
      this.props.comment.id,
      (comment, errors) => {
        if (errors) {
          this.setState({ error: errors[0].message })
          return
        }
        this.handleToggleEdit()
      },
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {draft} = this.state
    this.updateDraft(draft.value)
    this.handleToggleEdit()
  }

  handleToggleDeleteConfirmation = () => {
    const {confirmDeleteDialogOpen} = this.state
    this.setState({
      confirmDeleteDialogOpen: !confirmDeleteDialogOpen,
    })
  }

  handleToggleEdit = () => {
    this.setState({ edit: !this.state.edit })
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
        className="mdc-card"
      >
        <div className="rn-card__overline">
          <UserLink className="rn-link rn-link--secondary" user={get(comment, "author", null)} />
          <span className="ml1">commented {timeDifferenceForDate(comment.createdAt)}</span>
        </div>
        <div className="rn-card__body">
          <HTML html={comment.bodyHTML} />
        </div>
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
    const study = get(this.props, "comment.study", null)
    const comment = get(this.props, "comment", {})

    return (
      <StudyBodyEditor study={study}>
        <form id="lesson-comment-form" onSubmit={this.handleSubmit}>
          <StudyBodyEditor.Main
            placeholder="Leave a comment"
            body={comment.body}
            draft={comment.draft}
            showFormButtonsFor="lesson-comment-form"
            onCancel={this.handleCancel}
            onChange={this.handleChange}
            onPreview={this.updateDraft}
            onPublish={this.handlePublish}
            study={study}
          />
        </form>
      </StudyBodyEditor>
    )
  }
}

export default createFragmentContainer(LessonComment, graphql`
  fragment LessonComment_comment on LessonComment {
    author {
      ...UserLink_user
    }
    body
    bodyHTML
    createdAt
    draft
    id
    publishedAt
    study {
      ...StudyBodyEditor_study
    }
    updatedAt
    viewerCanDelete
    viewerCanUpdate
    viewerDidAuthor
  }
`)
