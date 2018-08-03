import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import UserActivity from 'components/UserActivity'
import { get } from 'utils'
import { EVENTS_PER_PAGE } from 'consts'

const UserOverviewPageQuery = graphql`
  query UserOverviewPageQuery($login: String!, $count: Int!, $after: String) {
    user(login: $login) {
      id
      ...UserActivity_user
    }
  }
`

class UserOverviewPage extends Component {
  render() {
    const { match } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={UserOverviewPageQuery}
        variables={{
          count: EVENTS_PER_PAGE,
          login: get(match.params, "login", ""),
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div>
                <UserActivity user={get(props, "user", null)} />
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(UserOverviewPage)
