import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import Study from './Study.js'

class StudyList extends Component {
  render() {
    return (
      <div>
        {this.props.viewer.studies.edges.map(({node}) => (
          <Study key={node.__id} study={node} />
        ))}
      </div>
    )
  }
}

export default createFragmentContainer(StudyList, graphql`
  fragment StudyList_viewer on User {
    studies(first:10, orderBy:{direction: DESC field:CREATED_AT}) @connection(key: "StudyList_studies", filters: []) {
      edges {
        node {
          ...Study_study
        }
      }
    }
  }
`)
