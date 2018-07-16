import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import AppleablePreview from 'components/AppleablePreview.js'
import { get } from 'utils'
import { APPLES_PER_PAGE } from 'consts'

const UserApplesPageQuery = graphql`
  query UserApplesPageQuery($login: String!, $count: Int!) {
    user(login: $login) {
      id
      appled(first: $count, orderBy:{direction: DESC field:APPLED_AT}, type: STUDY)
        @connection(key: "UserApplesPage_appled", filters: []) {
        edges {
          node {
            ...on Study {
              ...StudyPreview_study
            }
          }
        }
      }
    }
  }
`

class UserApplesPage extends Component {
  render() {
    const { match } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={UserApplesPageQuery}
        variables={{
          login: get(match.params, "login", ""),
          count: APPLES_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const appleEdges = get(props, "user.appled.edges", [])
            return (
              <div>
                {appleEdges.map(({node}) => (
                  <AppleablePreview key={node.__id} apple={node} />
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

export default withRouter(UserApplesPage)
