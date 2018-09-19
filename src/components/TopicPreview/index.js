import React, { Component } from 'react'
import cls from 'classnames'
import Relay, { graphql } from 'react-relay'
import hoistNonReactStatic from 'hoist-non-react-statics'
import { Link } from 'react-router-dom'
import { get } from 'utils'
import SearchTopicPreview from './SearchTopicPreview'

const FRAGMENT = graphql`
  fragment TopicPreview_topic on Topic {
    createdAt
    description
    name
    resourcePath
  }
`
class TopicPreview extends Component {
  static Search = Relay.createFragmentContainer(SearchTopicPreview, FRAGMENT)

  get classes() {
    const {className} = this.props
    return cls("TopicPreview flex flex-column items-center", className)
  }

  render() {
    const topic = get(this.props, "topic", {})
    return (
      <Link className={this.classes} to={topic.resourcePath}>
        <h5>{topic.name}</h5>
        <div>{topic.description}</div>
      </Link>
    )
  }
}

export default hoistNonReactStatic(
  Relay.createFragmentContainer(TopicPreview, FRAGMENT),
  TopicPreview,
)
