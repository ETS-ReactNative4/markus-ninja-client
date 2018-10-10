import * as React from 'react'
import cls from 'classnames'
import Relay, {
  graphql,
} from 'react-relay'
import hoistNonReactStatic from 'hoist-non-react-statics'
import { Link } from 'react-router-dom'
import pluralize from 'pluralize'
import { get, isNil, timeDifferenceForDate } from 'utils'
import AppleCoursePreview from './AppleCoursePreview'
import CardCoursePreview from './CardCoursePreview'
import StudyCoursePreview from './StudyCoursePreview'
import SearchCoursePreview from './SearchCoursePreview'
import UserCoursePreview from './UserCoursePreview'

const FRAGMENT =  graphql`
  fragment CoursePreview_course on Course {
    ...AppleButton_appleable
    advancedAt
    appleGivers(first: 0) {
      totalCount
    }
    createdAt
    description
    descriptionHTML
    id
    lessonCount
    name
    number
    owner {
      ...UserLink_user
      login
    }
    resourcePath
    study {
      name
      resourcePath
    }
    topics(first: 5) {
      nodes {
        id
        ...TopicLink_topic
      }
    }
    viewerCanApple
    viewerHasAppled
  }
`

class CoursePreview extends React.Component {
  static Apple = Relay.createFragmentContainer(AppleCoursePreview, FRAGMENT)
  static Card = Relay.createFragmentContainer(CardCoursePreview, FRAGMENT)
  static Study = Relay.createFragmentContainer(StudyCoursePreview, FRAGMENT)
  static Search = Relay.createFragmentContainer(SearchCoursePreview, FRAGMENT)
  static User = Relay.createFragmentContainer(UserCoursePreview, FRAGMENT)

  get classes() {
    const {className} = this.props
    return cls("CoursePreview", className)
  }

  render() {
    const course = get(this.props, "course", {})
    return (
      <div className={this.classes}>
        <div className="CoursePreview__info">
          <Link to={course.resourcePath}>
            {course.name}
          </Link>
          <span className="ml1">({course.lessonCount} {pluralize("lesson", course.lessonCount)})</span>
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
