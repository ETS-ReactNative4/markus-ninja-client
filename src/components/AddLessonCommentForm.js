import React, {Component} from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import AddLessonCommentMutation from 'mutations/AddLessonCommentMutation'
import LoginLink from 'components/LoginLink'
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

  get classes() {
    const {className} = this.props
    return cls("AddLessonCommentForm", className)
  }

  render() {
    const { error, submitted } = this.state
    if (!isAuthenticated()) {
      return (
        <div className={this.classes}>
          <LoginLink>Login to leave a comment</LoginLink>
        </div>
      )
    }
    return (
      <form className={this.classes} onSubmit={this.handleSubmit}>
        <RichTextEditor
          id="AddLessonCommentForm__body"
          onChange={this.handleChangeBody}
          submit={submitted}
          placeholder="Leave a comment"
          study={get(this.props, "lesson.study", null)}
        />
        <button className="mdc-button mdc-button--unelevated" type="submit">Comment</button>
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
      (response, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
        }
        this.setState({ submitted: true })
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
