import React, {Component} from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import AddCourseLessonMutation from 'mutations/AddCourseLessonMutation'
import StudyLessonSelect from 'components/StudyLessonSelect'
import { get, isNil } from 'utils'

class AddCourseLessonForm extends Component {
  state = {
    error: null,
    lessonId: "",
  }

  render() {
    const course = get(this.props, "course", {})
    if (!course.viewerCanAdmin) {
      return null
    }
    return (
      <form onSubmit={this.handleSubmit}>
        <StudyLessonSelect
          isCourseLesson={false}
          study={get(course, "study", null)}
          onChange={this.handleChangeLesson}
        />
        <button className="mdc-button mdc-button--unelevated" type="submit">
          Add lesson
        </button>
      </form>
    )
  }

  handleChangeLesson = (lessonId) => {
    this.setState({ lessonId })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { lessonId } = this.state
    AddCourseLessonMutation(
      this.props.course.id,
      lessonId,
      (response, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
        }
      }
    )
  }
}

export default withRouter(createFragmentContainer(AddCourseLessonForm, graphql`
  fragment AddCourseLessonForm_course on Course {
    id
    study {
      ...StudyLessonSelect_study
    }
    viewerCanAdmin
  }
`))
