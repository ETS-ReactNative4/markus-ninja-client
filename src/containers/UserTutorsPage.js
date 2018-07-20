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

const UserTutorsPageQuery = graphql`
  query UserTutorsPageQuery($login: String!, $count: Int!) {
    user(login: $login) {
      id
      enrolled(first: $count, type: USER)
        @connection(key: "UserTutorsPage_enrolled", filters: []) {
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

class UserTutorsPage extends Component {
  render() {
    const { match } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={UserTutorsPageQuery}
        variables={{
          login: get(match.params, "login", ""),
          count: USERS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const enrolledEdges = get(props, "user.enrolled.edges", [])
            return (
              <div>
                {enrolledEdges.map(({node}) => (
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

export default withRouter(UserTutorsPage)
