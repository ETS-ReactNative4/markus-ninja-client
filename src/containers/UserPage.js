import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import queryString from 'query-string'
import environment from 'Environment'
import User from 'components/User'
import UserApplesPage from 'containers/UserApplesPage'
import UserOverviewPage from 'containers/UserOverviewPage'
import UserPupilsPage from 'containers/UserPupilsPage'
import UserStudiesPage from 'containers/UserStudiesPage'
import UserTutorsPage from 'containers/UserTutorsPage'
import { get } from 'utils'

const UserPageQuery = graphql`
  query UserPageQuery($login: String!) {
    user(login: $login) {
      id
      ...User_user
    }
  }
`

class UserPage extends Component {
  render() {
    const { location, match } = this.props
    const Tab = (props) => {
      const query = queryString.parse(get(location, "search", ""))
      const tab = get(query, "tab", "")
      switch (tab.toLowerCase()) {
        case "apples":
          return <UserApplesPage {...props} />
        case "pupils":
          return <UserPupilsPage {...props} />
        case "studies":
          return <UserStudiesPage {...props} />
        case "tutors":
          return <UserTutorsPage {...props} />
        default:
          return <UserOverviewPage {...props} />
      }
    }
    return (
      <QueryRenderer
        environment={environment}
        query={UserPageQuery}
        variables={{
          login: get(match.params, "login", ""),
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className="UserPage">
                <User user={get(props, "user", null)}></User>
                <Tab />
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default UserPage
