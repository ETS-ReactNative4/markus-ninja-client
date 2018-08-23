import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import moment from 'moment'
import HTML from 'components/HTML'
import RichTextEditor from 'components/RichTextEditor'
import DeleteLessonCommentMutation from 'mutations/DeleteLessonCommentMutation'
import UpdateLessonCommentMutation from 'mutations/UpdateLessonCommentMutation'
import { get, isNil } from 'utils'

class LessonComment extends Component {
  state = {
    edit: false,
    error: null,
    body: get(this.props, "comment.body", ""),
  }

  render() {
    const study = get (this.props, "comment.study", null)
    const comment = get(this.props, "comment", {})
    const { edit, error, body } = this.state
    if (!edit) {
      return (
        <div
          id={`lesson_comment${moment(comment.createdAt).unix()}`}
          className="LessonComment mdc-card"
        >
          <HTML className="ph3" html={comment.bodyHTML} />
          <div className="mdc-card__actions">
            <div className="mdc-card__actions-buttons">
              {comment.viewerDidAuthor &&
                <button className="mdc-button mdc-button--outlined" disabled>Author</button>}
            </div>
            {comment.viewerCanDelete &&
            <div className="mdc-card__actions-icons">
              <button
                className="material-icons mdc-icon-button mdc-card__action--icon"
                type="button"
                onClick={this.handleDelete}
              >
                delete
              </button>
            </div>}
            {comment.viewerCanUpdate &&
            <button
              className="material-icons mdc-icon-button mdc-card__action--icon"
              type="button"
              onClick={this.handleToggleEdit}
            >
              edit
            </button>}
          </div>
        </div>
      )
    } else if (comment.viewerCanUpdate) {
      return (
        <form onSubmit={this.handleSubmit}>
          <RichTextEditor
            id="LessonComment__body"
            placeholder="Leave a comment"
            initialValue={body}
            study={study}
            onChange={this.handleChange}
          />
          <button type="submit">Update comment</button>
          <button onClick={this.handleToggleEdit}>Cancel</button>
          <span>{error}</span>
        </form>
      )
    }
    return null
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
      (error) => {
        if (!isNil(error)) {
          this.setState({ error: error.message })
        }
        this.handleToggleEdit()
      },
    )
  }

  handleToggleEdit = () => {
    this.setState({ edit: !this.state.edit })
  }
}

export default createFragmentContainer(LessonComment, graphql`
  fragment LessonComment_comment on LessonComment {
    id
    createdAt
    body
    bodyHTML
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
