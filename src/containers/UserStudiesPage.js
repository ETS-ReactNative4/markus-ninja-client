import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import StudyPreview from 'components/StudyPreview.js'
import { get } from 'utils'
import { STUDIES_PER_PAGE } from 'consts'

const UserStudiesPageQuery = graphql`
  query UserStudiesPageQuery($login: String!, $count: Int!) {
    user(login: $login) {
      id
      studies(first: $count, orderBy:{direction: DESC field:CREATED_AT})
        @connection(key: "UserStudiesPage_studies", filters: []) {
        edges {
          node {
            ...StudyPreview_study
          }
        }
      }
    }
  }
`

class UserStudiesPage extends Component {
  render() {
    const { match } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={UserStudiesPageQuery}
        variables={{
          login: get(match.params, "login", ""),
          count: STUDIES_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const studyEdges = get(props, "user.studies.edges", [])
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

export default withRouter(UserStudiesPage)
