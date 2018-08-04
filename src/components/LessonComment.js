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
    const comment = get(this.props, "comment", {})
    const { edit, error, body } = this.state
    if (!edit) {
      return (
        <div
          id={`lesson_comment${moment(comment.createdAt).unix()}`}
          className="LessonComment"
        >
          <ul>
            {comment.viewerDidAuthor &&
            <li>
              <span>Author</span>
            </li>}
            {comment.viewerCanDelete &&
            <li>
              <button className="btn" type="button" onClick={this.handleDelete}>
                Delete
              </button>
            </li>}
          </ul>
          <HTML className="LessonComment__bodyHTML" html={comment.bodyHTML} />
          {comment.viewerCanUpdate &&
          <button
            className="LessonComment__edit"
            onClick={this.handleToggleEdit}
          >
            Edit
          </button>}
        </div>
      )
    } else if (comment.viewerCanUpdate) {
      return (
        <form onSubmit={this.handleSubmit}>
          <RichTextEditor
            id="LessonComment__body"
            onChange={this.handleChange}
            placeholder="Leave a comment"
            initialValue={body}
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
    updatedAt
    viewerCanDelete
    viewerCanUpdate
    viewerDidAuthor
  }
`)
