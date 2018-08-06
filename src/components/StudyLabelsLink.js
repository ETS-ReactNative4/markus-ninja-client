import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class StudyLabelsLink extends Component {
  render() {
    const study = get(this.props, "study", {})
    return (
      <Link to={study.resourcePath + "/labels"}>
        {this.props.children}
      </Link>
    )
  }
}

export default createFragmentContainer(StudyLabelsLink, graphql`
  fragment StudyLabelsLink_study on Study {
    resourcePath
  }
`)
