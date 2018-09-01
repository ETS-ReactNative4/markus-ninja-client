import React, { Component } from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class TopicPreview extends Component {
  get classes() {
    const {className} = this.props
    return cls("TopicPreview flex flex-column items-center", className)
  }

  render() {
    const topic = get(this.props, "topic", {})
    return (
      <Link className={this.classes} to={topic.resourcePath}>
        <div className="mdc-typography--headline5">{topic.name}</div>
        <div>{topic.description}</div>
      </Link>
    )
  }
}

export default createFragmentContainer(TopicPreview, graphql`
  fragment TopicPreview_topic on Topic {
    description
    name
    resourcePath
  }
`)
