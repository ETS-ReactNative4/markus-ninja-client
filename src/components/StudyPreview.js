import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'

class StudyPreview extends Component {
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

export default createFragmentContainer(StudyPreview, graphql`
  fragment StudyPreview_study on Study {
    id
    description
    nameWithOwner
    url
  }
`)
