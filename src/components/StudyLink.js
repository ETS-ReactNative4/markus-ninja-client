import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class StudyLink extends Component {
  render() {
    const study = get(this.props, "study", {})
    return (
      <Link to={study.resourcePath}>
        {study.nameWithOwner}
      </Link>
    )
  }
}

export default createFragmentContainer(StudyLink, graphql`
  fragment StudyLink_study on Study {
    id
    nameWithOwner
    resourcePath
  }
`)
