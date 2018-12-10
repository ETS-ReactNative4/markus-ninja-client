import * as React from 'react'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { Link, withRouter } from 'react-router-dom';
import Icon from 'components/Icon'
import {get} from 'utils'
import {mediaQueryPhone} from 'styles/helpers'

class LessonCourse extends React.Component {
  render() {
    const lesson = get(this.props, "lesson", {})
    const course = get(lesson, "course", {})
    const {previousLesson, nextLesson} = lesson
    const mq = mediaQueryPhone()

    return (
      <div className="mdc-list-item">
        <Icon className="mdc-list-item__graphic" icon="course" />
        <span className="mdc-list-item__text">
          <Link
            className="rn-link mdc-typography--headline6"
            to={course.resourcePath}
          >
            {course.name}
          </Link>
          <span className="mdc-theme--text-hint-on-light ml2">#{lesson.courseNumber}</span>
        </span>
        <span className="mdc-list-item__meta">
          <span className="flex items-center justify-end hidden">
            {previousLesson &&
              (mq.matches
              ? <Link
                  className="material-icons mdc-icon-button"
                  to={previousLesson.resourcePath}
                  aria-label="Previous lesson"
                  title="Previous lesson"
                >
                  arrow_back
                </Link>
              : <Link
                  className="mdc-button mr2"
                  to={previousLesson.resourcePath}
                >
                  <i className="material-icons mdc-button__icon" aria-hidden="true">arrow_back</i>
                  Previous
                </Link>)
            }
            {nextLesson &&
              (mq.matches
              ? <Link
                  className="material-icons mdc-icon-button mdc-theme--text-primary-on-light"
                  to={nextLesson.resourcePath}
                  aria-label="Next lesson"
                  title="Next lesson"
                >
                  arrow_forward
                </Link>
              : <Link
                  className="mdc-button mdc-button--unelevated"
                  to={nextLesson.resourcePath}
                >
                  <i className="material-icons mdc-button__icon" aria-hidden="true">arrow_forward</i>
                  Next
                </Link>)
            }
          </span>
        </span>
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(LessonCourse, graphql`
  fragment LessonCourse_lesson on Lesson {
    course {
      name
      resourcePath
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
