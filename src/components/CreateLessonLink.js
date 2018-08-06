import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class CreateLessonLink extends Component {
  render() {
    const study = get(this.props, "study", {})
    return (
      <Link to={study.resourcePath + "/lessons/new"}>
        {this.props.children}
      </Link>
    )
  }
}

export default createFragmentContainer(CreateLessonLink, graphql`
  fragment CreateLessonLink_study on Study {
    resourcePath
  }
`)
