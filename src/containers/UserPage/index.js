import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import queryString from 'query-string'
import environment from 'Environment'
import UserHeader from './UserHeader'
import UserNav from './UserNav'
import UserApplesTab from './UserApplesTab'
import UserOverviewTab from './UserOverviewTab'
import UserPupilsTab from './UserPupilsTab'
import UserStudiesTab from './UserStudiesTab'
import UserTutorsTab from './UserTutorsTab'
import { get, isNil } from 'utils'
import NotFound from 'components/NotFound'

const UserPageQuery = graphql`
  query UserPageQuery($login: String!) {
    user(login: $login) {
      id
      ...UserHeader_user
      ...UserNav_user
      ...UserOverviewTab_user
      ...UserStudiesTab_user
    }
  }
`

class UserPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("UserPage mdc-layout-grid", className)
  }

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
              <div className={this.classes}>
                <div className="mdc-layout-grid__inner">
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    <UserHeader user={props.user} />
                  </div>
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    <div className="mdc-layout-grid__inner">
                      <div className="mdc-layout-grid__cell--span-12" >
                        <UserNav user={props.user} />
                      </div>
                      <div className="mdc-layout-grid__cell--span-12" >
                        <Tab user={props.user} />
                      </div>
                    </div>
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
