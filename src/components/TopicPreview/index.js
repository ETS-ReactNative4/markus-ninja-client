import * as React from 'react'
import cls from 'classnames'
import Relay, { graphql } from 'react-relay'
import hoistNonReactStatic from 'hoist-non-react-statics'
import { Link } from 'react-router-dom'
import { get } from 'utils'
import CardTopicPreview from './CardTopicPreview'
import ListTopicPreview from './ListTopicPreview'

const FRAGMENT = graphql`
  fragment TopicPreview_topic on Topic {
    createdAt
    topicables(first: 0, type: COURSE) {
      courseCount
      studyCount
    }
    description
    name
    resourcePath
  }
`
class TopicPreview extends React.Component {
  static Card = Relay.createFragmentContainer(CardTopicPreview, FRAGMENT)
  static List = Relay.createFragmentContainer(ListTopicPreview, FRAGMENT)

  get classes() {
    const {className} = this.props
    return cls("TopicPreview flex flex-column items-center", className)
  }

  render() {
    const topic = get(this.props, "topic", {})
    return (
      <Link className={this.classes} to={topic.resourcePath}>
        <h5>{topic.name.toUpperCase()}</h5>
        <p className="mdc-theme--text-secondary-on-light">
          {topic.description}
        </p>
      </Link>
    )
  }
}

export default hoistNonReactStatic(
  Relay.createFragmentContainer(TopicPreview, FRAGMENT),
  TopicPreview,
)
