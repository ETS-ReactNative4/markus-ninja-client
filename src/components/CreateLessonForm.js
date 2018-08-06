import React, {Component} from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import CreateLessonMutation from 'mutations/CreateLessonMutation'
import RichTextEditor from 'components/RichTextEditor'
import StudyCourseSelect from 'components/StudyCourseSelect'
import { get } from 'utils'

class CreateLessonForm extends Component {
  state = {
    error: null,
    body: "",
    courseId: "",
    title: "",
  }

  render() {
    const { title, error } = this.state
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="lesson-title">Lesson title (optional)</label>
        <input
          id="lesson-title"
          type="text"
          name="title"
          value={title}
          onChange={(e) => this.setState({title: e.target.value})}
        />
        <label htmlFor="lesson-course">Course (optional)</label>
        <StudyCourseSelect
          study={get(this.props, "study", null)}
          onChange={(courseId) => this.setState({ courseId })}
        />
        <label htmlFor="lesson-body">Body</label>
        <RichTextEditor
          id="lesson-body"
          onChange={this.handleChangeBody}
          placeholder="Begin your lesson"
          study={get(this.props, "study", null)}
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
    const { body, courseId, title } = this.state
    CreateLessonMutation(
      this.props.study.id,
      title,
      body,
      courseId,
      (response, error) => {
        this.props.history.push(response.createLesson.resourcePath)
      }
    )
  }
}

export default withRouter(createFragmentContainer(CreateLessonForm, graphql`
  fragment CreateLessonForm_study on Study {
    id
    ...RichTextEditor_study
    ...StudyCourseSelect_study
  }
`))
