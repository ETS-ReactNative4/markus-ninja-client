import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import queryString from 'query-string'
import environment from 'Environment'
import User from 'components/User'
import UserApplesPage from 'containers/UserApplesPage'
import UserStudiesPage from 'containers/UserStudiesPage'
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
      const tab = queryString.parse(get(location, "search", "")).tab
      switch (tab) {
        case "apples":
          return <UserApplesPage {...props} />
        case "studies":
          return <UserStudiesPage {...props} />
        default:
          return null
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
