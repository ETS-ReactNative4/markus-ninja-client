import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import UserTutors from './UserTutors'
import {get} from 'utils'
import { USERS_PER_PAGE } from 'consts'

const UserTutorsTabQuery = graphql`
  query UserTutorsTabQuery($login: String!, $count: Int!, $after: String) {
    user(login: $login) {
      ...UserTutors_user @arguments(
        count: $count,
        after: $after,
      )
    }
  }
`

class UserTutorsTab extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("UserTutorsTab", className)
  }

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
            return <UserTutors user={props.user} />
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(UserTutorsTab)
