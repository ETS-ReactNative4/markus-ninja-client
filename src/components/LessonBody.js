import React, {Component} from 'react'
import convert from 'htmr'
import RichTextEditor from 'components/RichTextEditor'
import UpdateLessonMutation from 'mutations/UpdateLessonMutation'
import { get, isNil } from 'utils'

class LessonBody extends Component {
  state = {
    edit: false,
    error: null,
    body: this.props.lesson.body,
  }

  render() {
    const lesson = get(this.props, "lesson", {})
    const { edit, error, body } = this.state
    if (!edit) {
      return (
        <div className="LessonBody">
          <div className="LessonBody__bodyHTML">{convert(lesson.bodyHTML)}</div>
          <button
            className="LessonBody__edit"
            onClick={this.handleToggleEdit}
          >
            Edit
          </button>
        </div>
      )
    } else {
      return (
        <form onSubmit={this.handleSubmit}>
          <RichTextEditor
            id="LessonBody__body"
            onChange={this.handleChange}
            placeholder="Begin your lesson"
            initialValue={body}
            study={get(lesson, "study", null)}
          />
          <button type="submit">Update lesson</button>
          <button onClick={this.handleToggleEdit}>Cancel</button>
          <span>{error}</span>
        </form>
      )
    }
  }

  handleChange = (body) => {
    this.setState({body})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { body } = this.state
    UpdateLessonMutation(
      this.props.lesson.id,
      null,
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

export default LessonBody
