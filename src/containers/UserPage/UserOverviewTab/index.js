import * as React from 'react'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {withRouter} from 'react-router'
import environment from 'Environment'
import UserPopularCourses from './UserPopularCourses'
import UserPopularStudies from './UserPopularStudies'
import UserTimeline from './UserTimeline'
import {get} from 'utils'
import {USER_EVENTS_PER_PAGE} from 'consts'

const UserOverviewTabQuery = graphql`
  query UserOverviewTabQuery($login: String!, $count: Int!, $after: String) {
    user(login: $login) {
      ...UserPopularCourses_user
      ...UserPopularStudies_user
      ...UserTimeline_user @arguments(
        count: $count,
        after: $after,
      )
    }
  }
`

class UserOverviewTab extends React.Component {
  render() {
    const { match } = this.props

    return (
      <QueryRenderer
        environment={environment}
        query={UserOverviewTabQuery}
        variables={{
          count: USER_EVENTS_PER_PAGE,
          login: get(match.params, "login", ""),
        }}
        render={({error,  props}) => {
          if (error) {
            return (
              <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                {error.message}
              </div>
            )
          } else if (props) {
            return (
              <React.Fragment>
                <UserPopularCourses user={props.user} />
                <UserPopularStudies user={props.user} />
                <UserTimeline user={props.user} />
              </React.Fragment>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(UserOverviewTab)
