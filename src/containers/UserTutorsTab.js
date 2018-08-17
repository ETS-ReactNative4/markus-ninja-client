import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import { withRouter } from 'react-router'
import environment from 'Environment'
import UserPreview from 'components/UserPreview'
import { get, isEmpty } from 'utils'
import { USERS_PER_PAGE } from 'consts'

const UserTutorsTabQuery = graphql`
  query UserTutorsTabQuery($login: String!, $count: Int!) {
    user(login: $login) {
      id
      isViewer
      enrolled(first: $count, type: USER)
        @connection(key: "UserTutorsTab_enrolled", filters: []) {
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

class UserTutorsTab extends Component {
  render() {
    const { match } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={UserTutorsTabQuery}
        variables={{
          login: get(match.params, "login", ""),
          count: USERS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const { className } = this.props
            const enrolledEdges = get(props, "user.enrolled.edges", [])
            if (isEmpty(enrolledEdges)) {
              return (
                <div className={cls("UserTutorsTab", className)}>
                  {props.user.isViewer
                  ? <span>
                      You have not enrolled in any users yet.
                      If you would like to receive notifications when certain users
                      create new studies, then go to their profile page and change your
                      enrollment status to Enrolled.
                    </span>
                  : <span>
                      This user has not enrolled in any users yet.
                    </span>}
                </div>
              )
            }
            return (
              <div className={cls("UserTutorsTab", className)}>
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

export default withRouter(UserTutorsTab)
