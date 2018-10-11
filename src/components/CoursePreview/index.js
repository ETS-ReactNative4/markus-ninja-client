import * as React from 'react'
import cls from 'classnames'
import Relay, {
  graphql,
} from 'react-relay'
import hoistNonReactStatic from 'hoist-non-react-statics'
import { Link } from 'react-router-dom'
import pluralize from 'pluralize'
import { get, isNil, timeDifferenceForDate } from 'utils'
import CardCoursePreview from './CardCoursePreview'
import ListCoursePreview from './ListCoursePreview'

const FRAGMENT =  graphql`
  fragment CoursePreview_course on Course {
    ...AppleButton_appleable
    advancedAt
    appleGiverCount
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
  static Card = Relay.createFragmentContainer(CardCoursePreview, FRAGMENT)
  static List = Relay.createFragmentContainer(ListCoursePreview, FRAGMENT)

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
