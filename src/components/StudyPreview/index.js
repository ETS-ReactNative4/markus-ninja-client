import * as React from 'react'
import Relay, {
  graphql,
} from 'react-relay'
import cls from 'classnames'
import hoistNonReactStatic from 'hoist-non-react-statics'
import StudyLink from 'components/StudyLink'
import { get } from 'utils'
import StudyPreviewLink from './StudyPreviewLink'
import UserStudyPreview from './UserStudyPreview'

const FRAGMENT = graphql`
  fragment StudyPreview_study on Study {
    ...StudyLink_study
    advancedAt
    createdAt
    descriptionHTML
    description
    isPrivate
    lessonCount
    nameWithOwner
    topics(first: 5) {
      nodes {
        ...TopicLink_topic
      }
    }
  }
`

class StudyPreview extends React.Component {
  static Link = Relay.createFragmentContainer(StudyPreviewLink, FRAGMENT)
  static User = Relay.createFragmentContainer(UserStudyPreview, FRAGMENT)

  render() {
    const { className } = this.props
    const study = get(this.props, "study", {})
    return (
      <div className={cls("StudyPreview", className)}>
        <StudyLink withOwner study={study} />
        <span className="ml1">{study.lessonCount} lessons</span>
        <span className="ml1">{study.description}</span>
      </div>
    )
  }
}

export default hoistNonReactStatic(
  Relay.createFragmentContainer(StudyPreview, FRAGMENT),
  StudyPreview
)
