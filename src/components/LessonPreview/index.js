import * as React from 'react'
import cls from 'classnames'
import Relay, {
  graphql,
} from 'react-relay'
import hoistNonReactStatic from 'hoist-non-react-statics'
import { Link } from 'react-router-dom'
import { get } from 'utils'
import CourseLessonPreview from './CourseLessonPreview'
import SearchLessonPreview from './SearchLessonPreview'
import StudyLessonPreview from './StudyLessonPreview'

const FRAGMENT = graphql`
  fragment LessonPreview_lesson on Lesson {
    author {
      ...UserLink_user
    }
    comments(first: 0) {
      totalCount
    }
    course {
      viewerCanAdmin
    }
    courseNumber
    createdAt
    id
    number
    resourcePath
    title
  }
`

class LessonPreview extends React.Component {
  static Course = Relay.createFragmentContainer(CourseLessonPreview, FRAGMENT)
  static Search = Relay.createFragmentContainer(SearchLessonPreview, FRAGMENT)
  static Study = Relay.createFragmentContainer(StudyLessonPreview, FRAGMENT)

  get classes() {
    const {className} = this.props
    return cls("LessonPreview", className)
  }

  render() {
    const lesson = get(this.props, "lesson", {})
    return (
      <span className={this.classes}>
        <Link className="rn-link" to={lesson.resourcePath}>
          <span className="mdc-typography--headline6">
            {lesson.title}
          </span>
          <span className="mdc-theme--text-secondary-on-light ml1">
            #{lesson.number}
          </span>
        </Link>
      </span>
    )
  }
}

export default hoistNonReactStatic(
  Relay.createFragmentContainer(LessonPreview, FRAGMENT),
  LessonPreview,
)
