import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import UserCourseApples from './UserCourseApples'
import UserStudyApples from './UserStudyApples'
import {get} from 'utils'
import { USERS_PER_PAGE } from 'consts'

const UserApplesTabQuery = graphql`
  query UserApplesTabQuery($login: String!, $count: Int!, $after: String) {
    user(login: $login) {
      ...UserCourseApples_user @arguments(
        count: $count,
        after: $after,
      )
      ...UserStudyApples_user @arguments(
        count: $count,
        after: $after,
      )
    }
  }
`

class UserApplesTab extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("UserApplesTab mdc-layout-grid__inner", className)
  }

  render() {
    const { match } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={UserApplesTabQuery}
        variables={{
          login: get(match.params, "login", ""),
          count: USERS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <UserCourseApples user={props.user} />
                </div>
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <UserStudyApples user={props.user} />
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

export default withRouter(UserApplesTab)
