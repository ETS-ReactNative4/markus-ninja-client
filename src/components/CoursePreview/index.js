import * as React from 'react'
import cls from 'classnames'
import Relay from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import hoistNonReactStatic from 'hoist-non-react-statics'
import { Link } from 'react-router-dom'
import pluralize from 'pluralize'
import { get, isNil, timeDifferenceForDate } from 'utils'
import CardCoursePreview from './CardCoursePreview'
import ListCoursePreview from './ListCoursePreview'

const FRAGMENT =  graphql`
  fragment CoursePreview_course on Course {
    advancedAt
    appleGivers(first: 0) {
      totalCount
    }
    createdAt
    description
    descriptionHTML
    id
    isPublished
    lessons(first: 0) {
      totalCount
    }
    name
    number
    owner {
      login
      resourcePath
    }
    resourcePath
    study {
      name
      resourcePath
    }
    topics(first: 2) {
      nodes {
        id
        name
        resourcePath
      }
    }
    viewerCanAdmin
    viewerCanApple
    viewerHasAppled
  }
`

class CoursePreview extends React.Component {
  static Card = Relay.createFragmentContainer(CardCoursePreview, FRAGMENT)
  static List = Relay.createFragmentContainer(ListCoursePreview, FRAGMENT)

  get classes() {
    const {className} = this.props
    return cls("CoursePreview", className)
  }

  render() {
    const course = get(this.props, "course", {})
    const lessonCount = get(course, "lessons.totalCount", 0)
    return (
      <div className={this.classes}>
        <div className="CoursePreview__info">
          <Link to={course.resourcePath}>
            {course.name}
          </Link>
          <span className="ml1">
            ({lessonCount} {pluralize("lesson", lessonCount)})
          </span>
          {!isNil(course.advancedAt) &&
          <span className="ml1">Advanced {timeDifferenceForDate(course.advancedAt)}</span>}
        </div>
        <div className="CoursePreview__description">{course.description}</div>
      </div>
    )
  }
}

export default hoistNonReactStatic(
  Relay.createFragmentContainer(CoursePreview, FRAGMENT),
  CoursePreview,
)
