import * as React from 'react'
import cls from 'classnames'
import Relay, {
  graphql,
} from 'react-relay'
import hoistNonReactStatic from 'hoist-non-react-statics'
import {Link} from 'react-router-dom'
import { get } from 'utils'
import CardStudyPreview from './CardStudyPreview'
import ListStudyPreview from './ListStudyPreview'

const FRAGMENT = graphql`
  fragment StudyPreview_study on Study {
    advancedAt
    appleGivers(first: 0) {
      totalCount
    }
    createdAt
    descriptionHTML
    description
    enrollmentStatus
    id
    isPrivate
    lessons(first: 0) {
      totalCount
    }
    name
    owner {
      login
      resourcePath
    }
    resourcePath
    topics(first: 5) {
      nodes {
        id
        name
        resourcePath
      }
    }
    viewerCanApple
    viewerCanEnroll
    viewerHasAppled
  }
`

class StudyPreview extends React.Component {
  static Card = Relay.createFragmentContainer(CardStudyPreview, FRAGMENT)
  static List = Relay.createFragmentContainer(ListStudyPreview, FRAGMENT)

  get classes() {
    const {className} = this.props
    return cls("StudyPreview", className)
  }

  render() {
    const study = get(this.props, "study", {})
    return (
      <div className={this.classes}>
        <Link to={study.resourcePath}>{study.name}</Link>
      </div>
    )
  }
}

export default hoistNonReactStatic(
  Relay.createFragmentContainer(StudyPreview, FRAGMENT),
  StudyPreview,
)
