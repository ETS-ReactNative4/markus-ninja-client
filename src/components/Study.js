import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'

class Study extends Component {
  render() {
    return (
      <div>
        <a href={this.props.study.url}>
          {this.props.study.description} ({this.props.study.nameWithOwner})
        </a>
      </div>
    )
  }
}

export default createFragmentContainer(Study, graphql`
  fragment Study_study on Study {
    id
    description
    nameWithOwner
    url
  }
`)
