import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import UserPreview from 'components/UserPreview'
import { get, isEmpty } from 'utils'
import { USERS_PER_PAGE } from 'consts'

const UserPupilsTabQuery = graphql`
  query UserPupilsTabQuery($login: String!, $count: Int!) {
    user(login: $login) {
      id
      isViewer
      enrollees(first: $count)
        @connection(key: "UserPupilsTab_enrollees", filters: []) {
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

class UserPupilsTab extends Component {
  render() {
    const { match } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={UserPupilsTabQuery}
        variables={{
          login: get(match.params, "login", ""),
          count: USERS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const enrolleeEdges = get(props, "user.enrollees.edges", [])
            if (isEmpty(enrolleeEdges)) {
              return (
                <div className="UserPupilsTab">
                  {props.user.isViewer
                  ? <span>
                      You do not have any pupils yet.
                    </span>
                  : <span>
                      This user does not have any pupils yet.
                    </span>}
                </div>
              )
            }
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

export default withRouter(UserPupilsTab)
