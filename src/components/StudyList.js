import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import StudyPreview from './StudyPreview.js'
import { get } from 'utils'

class StudyList extends Component {
  render() {
    const studyEdges = get(this.props, "viewer.studies.edges", [])
    return (
      <div>
        {studyEdges.map(({node}) => (
          <StudyPreview key={node.__id} study={node} />
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
          ...StudyPreview_study
        }
      }
    }
  }
`)
