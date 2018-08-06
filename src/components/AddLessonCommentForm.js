import React, {Component} from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import AddLessonCommentMutation from 'mutations/AddLessonCommentMutation'
import RichTextEditor from 'components/RichTextEditor'
import { get, isNil } from 'utils'
import { isAuthenticated } from 'auth'

class AddLessonCommentForm extends Component {
  state = {
    error: null,
    body: "",
    submitted: false,
  }

  componentDidUpdate() {
    if (this.state.submitted) {
      this.setState({ submitted: false })
    }
  }

  render() {
    const { error, submitted } = this.state
    if (!isAuthenticated()) {
      return (
        <div className="AddLessonCommentForm">
          <Link to="/login">Login to leave a comment</Link>
        </div>
      )
    }
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="AddLessonCommentForm__body">Body</label>
        <RichTextEditor
          id="AddLessonCommentForm__body"
          onChange={this.handleChangeBody}
          submit={submitted}
          placeholder="Leave a comment"
          study={get(this.props, "lesson.study", null)}
        />
        <button type="submit">Comment</button>
        <span>{error}</span>
      </form>
    )
  }

  handleChangeBody = (body) => {
    this.setState({body})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { body } = this.state
    AddLessonCommentMutation(
      this.props.lesson.id,
      body,
      (response, error) => {
        if (!isNil(error)) {
          this.setState({ error: error.message })
        } else {
          this.setState({ submitted: true })
        }
      }
    )
  }
}

export default withRouter(createFragmentContainer(AddLessonCommentForm, graphql`
  fragment AddLessonCommentForm_lesson on Lesson {
    id
    study {
      ...RichTextEditor_study
    }
  }
`))
