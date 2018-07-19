import React, {Component} from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import CreateLessonMutation from 'mutations/CreateLessonMutation'
import RichTextEditor from 'components/RichTextEditor'

class CreateLessonForm extends Component {
  state = {
    error: null,
    body: "",
    title: "",
  }

  render() {
    const { title, error } = this.state
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="CreateLessonForm__title">Lesson title (optional)</label>
        <input
          id="CreateLessonForm__title"
          type="text"
          name="title"
          value={title}
          onChange={(e) => this.setState({title: e.target.value})}
        />
        <label htmlFor="CreateLessonForm__body">Body</label>
        <RichTextEditor
          id="CreateLessonForm__body"
          onChange={this.handleChangeBody}
          placeholder="Begin your lesson"
        />
        <button type="submit">Create lesson</button>
        <span>{error}</span>
      </form>
    )
  }

  handleChangeBody = (body) => {
    this.setState({body})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { body, title } = this.state
    CreateLessonMutation(
      this.props.study.id,
      title,
      body,
      (response, error) => {
        this.props.history.push(response.createLesson.resourcePath)
      }
    )
  }
}

export default withRouter(createFragmentContainer(CreateLessonForm, graphql`
  fragment CreateLessonForm_study on Study {
    id
  }
`))
