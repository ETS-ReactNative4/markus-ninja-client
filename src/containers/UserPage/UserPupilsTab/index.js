import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import UserPupils from './UserPupils'
import {get} from 'utils'
import { USERS_PER_PAGE } from 'consts'

const UserPupilsTabQuery = graphql`
  query UserPupilsTabQuery($login: String!, $count: Int!, $after: String) {
    user(login: $login) {
      ...UserPupils_user @arguments(
        count: $count,
        after: $after,
      )
    }
  }
`

class UserPupilsTab extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("UserPupilsTab", className)
  }

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
            return <UserPupils user={props.user} />
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(UserPupilsTab)
