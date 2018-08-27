import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import queryString from 'query-string'
import environment from 'Environment'
import User from 'components/User'
import UserTabs from 'components/User/UserTabs'
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
      ...UserTabs_user
      ...UserOverviewTab_user
      ...UserStudiesTab_user
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
              <div className="UserPage mdc-layout-grid">
                <div className="mdc-layout-grid__inner">
                  <User
                    className={cls(
                      "mdc-layout-grid__cell",
                      "mdc-layout-grid__cell--span-3-desktop",
                      "mdc-layout-grid__cell--span-2-tablet",
                      "mdc-layout-grid__cell--span-1-phone",
                    )}
                    user={props.user}
                  />
                  <div
                    className={cls(
                      "mdc-layout-grid__inner",
                      "mdc-layout-grid__cell--span-9-desktop",
                      "mdc-layout-grid__cell--span-10-tablet",
                      "mdc-layout-grid__cell--span-11-phone",
                    )}
                  >
                    <UserTabs
                      className={cls(
                        "mdc-layout-grid__cell",
                        "mdc-layout-grid__cell--span-12",
                      )}
                      user={props.user}
                    />
                    <Tab
                      className={cls(
                        "mdc-layout-grid__cell",
                        "mdc-layout-grid__cell--span-12",
                      )}
                      user={props.user}
                    />
                  </div>
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

export default UserPage
