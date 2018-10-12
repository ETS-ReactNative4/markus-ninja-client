import * as React from 'react'
import cls from 'classnames'
import Relay, {
  graphql,
} from 'react-relay'
import hoistNonReactStatic from 'hoist-non-react-statics'
import { Link } from 'react-router-dom'
import { get } from 'utils'
import CardLessonPreview from './CardLessonPreview'
import ListLessonPreview from './ListLessonPreview'

import './styles.css'

const FRAGMENT = graphql`
  fragment LessonPreview_lesson on Lesson {
    ...EnrollButton_enrollable
    author {
      ...UserLink_user
      login
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
    labels(first: 5) {
      nodes {
        id
        ...LabelLink_label
      }
    }
    number
    resourcePath
    title
  }
`

class LessonPreview extends React.Component {
  static Card = Relay.createFragmentContainer(CardLessonPreview, FRAGMENT)
  static List = Relay.createFragmentContainer(ListLessonPreview, FRAGMENT)

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
