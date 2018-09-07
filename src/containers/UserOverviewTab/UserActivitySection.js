import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import UserActivity from './UserActivity'
import { get } from 'utils'
import {EVENTS_PER_PAGE} from 'consts'

const UserActivitySectionQuery = graphql`
  query UserActivitySectionQuery($login: String!, $count: Int!, $after: String) {
    user(login: $login) {
      ...UserActivity_user @arguments(
        count: $count,
        after: $after,
      )
    }
  }
`

class UserActivitySection extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("UserActivitySection", className)
  }

  render() {
    const { match } = this.props

    return (
      <QueryRenderer
        environment={environment}
        query={UserActivitySectionQuery}
        variables={{
          count: EVENTS_PER_PAGE,
          login: get(match.params, "login", ""),
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className={this.classes}>
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

export default withRouter(UserActivitySection)
