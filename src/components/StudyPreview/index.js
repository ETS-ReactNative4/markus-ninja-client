import * as React from 'react'
import cls from 'classnames'
import Relay, {
  graphql,
} from 'react-relay'
import hoistNonReactStatic from 'hoist-non-react-statics'
import StudyLink from 'components/StudyLink'
import { get } from 'utils'
import AppleStudyPreview from './AppleStudyPreview'
import ResearchStudyPreview from './ResearchStudyPreview'
import StudyPreviewLink from './StudyPreviewLink'
import UserStudyPreview from './UserStudyPreview'

const FRAGMENT = graphql`
  fragment StudyPreview_study on Study {
    ...AppleButton_appleable
    ...StudyLink_study
    advancedAt
    appleGivers(first: 0) {
      totalCount
    }
    createdAt
    descriptionHTML
    description
    isPrivate
    lessonCount
    nameWithOwner
    resourcePath
    topics(first: 5) {
      nodes {
        ...TopicLink_topic
      }
    }
  }
`

class StudyPreview extends React.Component {
  static Apple = Relay.createFragmentContainer(AppleStudyPreview, FRAGMENT)
  static Link = Relay.createFragmentContainer(StudyPreviewLink, FRAGMENT)
  static Research = Relay.createFragmentContainer(ResearchStudyPreview, FRAGMENT)
  static User = Relay.createFragmentContainer(UserStudyPreview, FRAGMENT)

  get classes() {
    const {className} = this.props
    return cls("StudyPreview", className)
  }

  render() {
    const study = get(this.props, "study", {})
    return (
      <div className={this.classes}>
        <StudyLink withOwner study={study} />
        <span className="ml1">{study.lessonCount} lessons</span>
        <span className="ml1">{study.description}</span>
      </div>
    )
  }
}

export default hoistNonReactStatic(
  Relay.createFragmentContainer(StudyPreview, FRAGMENT),
  StudyPreview,
)
