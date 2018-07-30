import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'
import StudyPreview from './StudyPreview'

class CreateablePreview extends Component {
  render() {
    const createable = get(this.props, "createable", {})
    switch(createable.__typename) {
      case "Study":
        return <StudyPreview study={createable} />
      default:
        return null
    }
  }
}

export default createFragmentContainer(CreateablePreview, graphql`
  fragment CreateablePreview_createable on Createable {
    __typename
    ... on Study {
      ...StudyPreview_study
    }
  }
`)
