import * as React from 'react'
import cls from 'classnames'
import Relay, {
  graphql,
} from 'react-relay'
import hoistNonReactStatic from 'hoist-non-react-statics'
import { Link } from 'react-router-dom'
import { get } from 'utils'
import CourseLessonPreview from './CourseLessonPreview'
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
  static Study = Relay.createFragmentContainer(StudyLessonPreview, FRAGMENT)

  get classes() {
    const {className} = this.props
    return cls("LessonPreview", className)
  }

  render() {
    const lesson = get(this.props, "lesson", {})
    return (
      <div className={this.classes}>
        <Link className="link" to={lesson.resourcePath}>
          {lesson.number}: {lesson.title}
        </Link>
      </div>
    )
  }
}

export default hoistNonReactStatic(
  Relay.createFragmentContainer(LessonPreview, FRAGMENT),
  LessonPreview,
)
