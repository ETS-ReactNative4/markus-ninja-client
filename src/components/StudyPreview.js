import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class StudyPreview extends Component {
  render() {
    const study = get(this.props, "study", {})
    return (
      <div className="StudyPreview">
        <Link to={study.resourcePath}>
          {study.nameWithOwner}
        </Link>
        <span>{study.lessonCount} lessons</span>
        <span>{study.description}</span>
      </div>
    )
  }
}

export default createFragmentContainer(StudyPreview, graphql`
  fragment StudyPreview_study on Study {
    description
    lessonCount
    nameWithOwner
    resourcePath
  }
`)
