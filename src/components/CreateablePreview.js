import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'

class CreateablePreview extends Component {
  render() {
    const createable = get(this.props, "createable", {})
    switch(createable.__typename) {
      case "Lesson":
        return <span>{get(createable, "title", "")}</span>
      case "Study":
        return <span>{get(createable, "name", "")}</span>
      default:
        return null
    }
  }
}

export default createFragmentContainer(CreateablePreview, graphql`
  fragment CreateablePreview_createable on Createable {
    __typename
    ... on Lesson {
      title
    }
    ... on Study {
      name
    }
  }
`)
