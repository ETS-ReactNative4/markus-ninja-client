import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  createFragmentContainer,
  graphql,
} from 'react-relay'
import {withRouter} from 'react-router'
import environment from 'Environment'
import UserPopularCourses from './UserPopularCourses'
import UserPopularStudies from './UserPopularStudies'
import UserActivity from './UserActivity'
import {get} from 'utils'
import {EVENTS_PER_PAGE} from 'consts'

const UserOverviewTabQuery = graphql`
  query UserOverviewTabQuery($login: String!, $count: Int!, $after: String, $within: ID!) {
    ...UserPopularCourses_query @arguments(
      within: $within,
    )
    ...UserPopularStudies_query @arguments(
      within: $within,
    )
    user(login: $login) {
      ...UserActivity_user @arguments(
        count: $count,
        after: $after,
      )
    }
  }
`

class UserOverviewTab extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("UserOverviewTab mdc-layout-grid__inner", className)
  }

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
            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <UserPopularCourses query={props} />
                </div>
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <UserPopularStudies query={props} />
                </div>
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <UserActivity user={props.user} />
                </div>
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
