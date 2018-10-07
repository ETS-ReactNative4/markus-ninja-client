import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import AddCourseLessonMutation from 'mutations/AddCourseLessonMutation'
import StudyLessonSelect from 'components/StudyLessonSelect'
import {get, isEmpty, isNil} from 'utils'

class AddCourseLessonForm extends React.Component {
  state = {
    error: null,
    lessonId: "",
  }

  get classes() {
    const {className} = this.props
    return cls("AddCourseLessonForm flex items-center", className)
  }

  get formSubmittable() {
    return !isEmpty(this.state.lessonId)
  }

  render() {
    const course = get(this.props, "course", {})
    if (!course.viewerCanAdmin) {
      return null
    }
    return (
      <form className={this.classes} onSubmit={this.handleSubmit}>
        <StudyLessonSelect
          filterBy={{
            isCourseLesson: false,
          }}
          study={get(course, "study", null)}
          onChange={this.handleChangeLesson}
        />
        <button
          className="mdc-button mdc-button--unelevated ml2"
          type="submit"
          disabled={!this.formSubmittable}
        >
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
  fragment AddCourseLessonForm_course on Course @argumentDefinitions(
    after: {type: "String"},
    count: {type: "Int!"},
    filterBy: {type: "LessonFilters"},
  ) {
    id
    study {
      ...StudyLessonSelect_study @arguments(
        after: $after,
        count: $count,
        filterBy: $filterBy,
      )
    }
    viewerCanAdmin
  }
`))
