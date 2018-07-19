import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'

class TopicPreview extends Component {
  render() {
    const topic = get(this.props, "topic", {})
    return (
      <div>
        <a href={topic.url}>
          <span>{topic.name}</span>
          <div>{topic.description}</div>
        </a>
      </div>
    )
  }
}

export default createFragmentContainer(TopicPreview, graphql`
  fragment TopicPreview_topic on Topic {
    description
    name
  }
`)
