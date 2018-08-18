import React, {Component} from 'react'
import {
  QueryRenderer,
  createFragmentContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import { withRouter } from 'react-router'
import environment from 'Environment'
import UserPopularStudies from 'components/UserPopularStudies'
import UserActivity from 'components/UserActivity'
import { get } from 'utils'
import { EVENTS_PER_PAGE } from 'consts'

const UserOverviewTabQuery = graphql`
  query UserOverviewTabQuery($login: String!, $count: Int!, $after: String, $within: ID!) {
    ...UserPopularStudies_query
    user(login: $login) {
      ...UserActivity_user
    }
  }
`

class UserOverviewTab extends Component {
  render() {
    const { match } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={UserOverviewTabQuery}
        variables={{
          count: EVENTS_PER_PAGE,
          login: get(match.params, "login", ""),
          within: get(this.props, "user.id", ""),
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const { className } = this.props

            return (
              <div className={cls("UserOverviewTab", className)}>
                <UserPopularStudies query={props} />
                <UserActivity user={props.user} />
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(createFragmentContainer(UserOverviewTab, graphql`
  fragment UserOverviewTab_user on User {
    id
  }
`))
