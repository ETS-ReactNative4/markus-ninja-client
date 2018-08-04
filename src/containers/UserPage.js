import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import queryString from 'query-string'
import environment from 'Environment'
import User from 'components/User'
import UserApplesTab from 'containers/UserApplesTab'
import UserOverviewTab from 'containers/UserOverviewTab'
import UserPupilsTab from 'containers/UserPupilsTab'
import UserStudiesTab from 'containers/UserStudiesTab'
import UserTutorsTab from 'containers/UserTutorsTab'
import { get, isNil } from 'utils'
import NotFound from 'components/NotFound'

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
          return <UserApplesTab {...props} />
        case "pupils":
          return <UserPupilsTab {...props} />
        case "studies":
          return <UserStudiesTab {...props} />
        case "tutors":
          return <UserTutorsTab {...props} />
        default:
          return <UserOverviewTab {...props} />
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
            if (isNil(props.user)) {
              return <NotFound />
            }
            return (
              <div className="UserPage">
                <User user={props.user}></User>
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
