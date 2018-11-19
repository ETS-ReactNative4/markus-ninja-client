import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class TopicLink extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("TopicLink", className)
  }

  render() {
    const topic = get(this.props, "topic", {})
    const {innerRef, ...props} = this.props
    return (
      <Link innerRef={innerRef} className={this.classes} to={topic.resourcePath} {...props}>
        {topic.name}
      </Link>
    )
  }
}

export default createFragmentContainer(TopicLink, graphql`
  fragment TopicLink_topic on Topic {
    id
    name
    resourcePath
  }
`)
