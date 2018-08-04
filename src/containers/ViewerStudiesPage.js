import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import environment from 'Environment'
import StudyPreview from 'components/StudyPreview.js'
import { get, isEmpty } from 'utils'
import { STUDIES_PER_PAGE } from 'consts'

const ViewerStudiesPageQuery = graphql`
  query ViewerStudiesPageQuery($count: Int!) {
    viewer {
      studies(first: $count, orderBy:{direction: DESC field:CREATED_AT})
        @connection(key: "ViewerStudiesPage_studies", filters: []) {
        edges {
          node {
            ...StudyPreview_study
          }
        }
      }
    }
  }
`

class ViewerStudiesPage extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={ViewerStudiesPageQuery}
        variables={{
          count: STUDIES_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const studyEdges = get(props, "viewer.studies.edges", [])
            if (isEmpty(studyEdges)) {
              return (
                <div className="ViewerStudiesPage">
                  <Link to="/new">Create a study to get started</Link>
                </div>
              )
            }
            return (
              <div>
                {studyEdges.map(({node}) => (
                  <StudyPreview key={node.__id} study={node} />
                ))}
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default ViewerStudiesPage
