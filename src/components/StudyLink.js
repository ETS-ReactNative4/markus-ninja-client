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
    const { withOwner = false } = this.props
    return (
      <Link className="link" to={study.resourcePath}>
        {withOwner ? study.nameWithOwner : study.name}
      </Link>
    )
  }
}

export default createFragmentContainer(StudyLink, graphql`
  fragment StudyLink_study on Study {
    id
    name
    nameWithOwner
    resourcePath
  }
`)
