import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import UserPreview from 'components/UserPreview'
import { get } from 'utils'
import { USERS_PER_PAGE } from 'consts'

const UserPupilsPageQuery = graphql`
  query UserPupilsPageQuery($login: String!, $count: Int!) {
    user(login: $login) {
      id
      enrollees(first: $count)
        @connection(key: "UserPupilsPage_enrollees", filters: []) {
        edges {
          node {
            id
            ...UserPreview_user
          }
        }
      }
    }
  }
`

class UserPupilsPage extends Component {
  render() {
    const { match } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={UserPupilsPageQuery}
        variables={{
          login: get(match.params, "login", ""),
          count: USERS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const enrolleeEdges = get(props, "user.enrollees.edges", [])
            return (
              <div>
                {enrolleeEdges.map(({node}) => (
                  <UserPreview key={node.__id} user={node} />
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

export default withRouter(UserPupilsPage)
