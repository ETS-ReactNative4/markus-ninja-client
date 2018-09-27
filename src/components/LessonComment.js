import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import moment from 'moment'
import HTML from 'components/HTML'
import RichTextEditor from 'components/RichTextEditor'
import UserLink from 'components/UserLink'
import DeleteLessonCommentMutation from 'mutations/DeleteLessonCommentMutation'
import UpdateLessonCommentMutation from 'mutations/UpdateLessonCommentMutation'
import {get, isNil, timeDifferenceForDate} from 'utils'

class LessonComment extends React.Component {
  state = {
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

  handleToggleEdit = () => {
    this.setState({ edit: !this.state.edit })
  }

  get classes() {
    const {className} = this.props
    return cls("LessonComment mdc-card mdc-card--outlined", className)
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
        className={this.classes}
      >
        <div className="mdc-typography--subtitle2 mdc-theme--text-secondary-on-light pa3">
          <UserLink className="rn-link rn-link--secondary" user={get(comment, "author", null)} />
          <span className="ml1">commented {timeDifferenceForDate(comment.createdAt)}</span>
        </div>
        <HTML className="ph3" html={comment.bodyHTML} />
        {comment.viewerCanUpdate &&
        <div className="mdc-card__actions">
          <div className="mdc-card__actions-buttons">
            {comment.viewerDidAuthor &&
              <button className="mdc-button mdc-button--outlined" disabled>Author</button>}
          </div>
          <div className="mdc-card__actions-icons">
            {comment.viewerCanDelete &&
            <button
              className="material-icons mdc-icon-button mdc-card__action--icon"
              type="button"
              onClick={this.handleDelete}
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
      </div>
    )
  }

  renderForm() {
    const study = get (this.props, "comment.study", null)
    const {body} = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <RichTextEditor
          id="LessonComment__body"
          placeholder="Leave a comment"
          initialValue={body}
          study={study}
          onChange={this.handleChange}
        />
        <button
          className="mdc-button mdc-button--unelevated"
          type="submit"
        >
          Update comment
        </button>
        <button onClick={this.handleToggleEdit}>Cancel</button>
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
