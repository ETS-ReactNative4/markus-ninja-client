import React, {Component} from 'react'
import { withRouter } from 'react-router-dom';
import CreateLessonMutation from 'mutations/CreateLessonMutation'
import RichTextEditor from 'components/RichTextEditor'

class CreateLessonForm extends Component {
  state = {
    error: null,
    body: "",
    title: "",
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="CreateLessonForm__title">Lesson title (optional)</label>
        <input
          id="CreateLessonForm__title"
          type="text"
          name="title"
          value={this.state.title}
          onChange={(e) => this.setState({title: e.target.value})}
        />
        <label htmlFor="CreateLessonForm__body">Body</label>
        <RichTextEditor
          id="CreateLessonForm__body"
          onChange={this.handleChangeBody}
        />
        <button type="submit">Create lesson</button>
        <span>{this.state.error}</span>
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
      body,
      this.props.study.__id,
      title,
      (response, error) => {
        this.props.history.push(response.createLesson.resourcePath)
      }
    )
  }
}

export default withRouter(CreateLessonForm)
