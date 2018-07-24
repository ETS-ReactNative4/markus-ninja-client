import React, {Component} from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import AddLessonCommentMutation from 'mutations/AddLessonCommentMutation'
import RichTextEditor from 'components/RichTextEditor'
import { isNil } from 'utils'

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
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="AddLessonCommentForm__body">Body</label>
        <RichTextEditor
          id="AddLessonCommentForm__body"
          onChange={this.handleChangeBody}
          submit={submitted}
          placeholder="Leave a comment"
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
  }
`))
