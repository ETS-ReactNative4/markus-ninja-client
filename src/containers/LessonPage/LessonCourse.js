import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link, withRouter } from 'react-router-dom';
import Icon from 'components/Icon'
import CourseLink from 'components/CourseLink'
import {get} from 'utils'

class LessonCourse extends React.Component {
  render() {
    const lesson = get(this.props, "lesson", {})
    const {previousLesson, nextLesson} = lesson

    return (
      <div>
        <span>
          <Icon className="v-mid mr1" icon="course" />
          <CourseLink className="rn-link mdc-typography--headline6" course={get(lesson, "course", null)} />
          <span className="mdc-theme--text-hint-on-light ml2">#{lesson.courseNumber}</span>
        </span>
        {previousLesson &&
        <Link className="mdc-button mdc-button--outlined ml2" to={previousLesson.resourcePath}>Previous lesson</Link>}
        {nextLesson &&
        <Link className="mdc-button mdc-button--unelevated ml2" to={nextLesson.resourcePath}>Next lesson</Link>}
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
