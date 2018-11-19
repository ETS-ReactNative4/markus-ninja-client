import * as React from 'react'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { Link, withRouter } from 'react-router-dom';
import Icon from 'components/Icon'
import CourseLink from 'components/CourseLink'
import {get} from 'utils'

class LessonCourse extends React.Component {
  render() {
    const lesson = get(this.props, "lesson", {})
    const {previousLesson, nextLesson} = lesson

    return (
      <div className="flex items-center">
        <Icon className="v-mid mr1" icon="course" />
        <CourseLink className="rn-link mdc-typography--headline6" course={get(lesson, "course", null)} />
        <span className="mdc-theme--text-hint-on-light ml2">#{lesson.courseNumber}</span>
        {previousLesson &&
        <Link
          className="material-icons mdc-icon-button mdc-theme--text-icon-on-background"
          to={previousLesson.resourcePath}
          aria-label="Previous lesson"
          title="Previous lesson"
        >
          arrow_back
        </Link>}
        {nextLesson &&
        <Link
          className="material-icons mdc-icon-button"
          to={nextLesson.resourcePath}
          aria-label="Next lesson"
          title="Next lesson"
        >
          arrow_forward
        </Link>}
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(LessonCourse, graphql`
  fragment LessonCourse_lesson on Lesson {
    course {
      ...CourseLink_course
    }
    courseNumber
    nextLesson {
      resourcePath
    }
    previousLesson {
      resourcePath
    }
  }
`))
