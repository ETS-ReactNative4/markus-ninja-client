import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'

class StudyPreview extends Component {
  render() {
    const study = get(this.props, "study", {})
    return (
      <div>
        <a href={study.url + "/lessons"}>
          {study.description} ({study.nameWithOwner})
        </a>
      </div>
    )
  }
}

export default createFragmentContainer(StudyPreview, graphql`
  fragment StudyPreview_study on Study {
    id
    description
    nameWithOwner
    url
  }
`)
