import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'
import StudyPreview from './StudyPreview'

class AppleablePreview extends Component {
  render() {
    const { appleable } = this.props
    switch(get(appleable, "__typename", "")) {
      case "Study":
        return <StudyPreview study={appleable} />
      default:
        return null
    }
  }
}

export default createFragmentContainer(AppleablePreview, graphql`
  fragment AppleablePreview_appleable on Appleable {
    __typename
    ... on Study {
      ...StudyPreview_study
    }
  }
`)
