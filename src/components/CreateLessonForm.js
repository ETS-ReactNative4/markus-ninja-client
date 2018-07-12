import React, {Component} from 'react'
import { withRouter } from 'react-router-dom';
import CreateLessonMutation from 'mutations/CreateLessonMutation'

class CreateLessonForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      body: "",
      title: "",
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit(e) {
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

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="CreateLessonForm__title">Lesson title (optional)</label>
        <input
          id="CreateLessonForm__title"
          type="text"
          name="title"
          value={this.state.title}
          onChange={this.handleChange}
        />
        <label htmlFor="CreateLessonForm__body">Body</label>
        <input
          id="CreateLessonForm__body"
          type="body"
          name="body"
          value={this.state.body}
          onChange={this.handleChange}
        />
        <button type="submit">Create lesson</button>
        <span>{this.state.error}</span>
      </form>
    )
  }
}

export default withRouter(CreateLessonForm)
