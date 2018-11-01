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
import UserAssetsTab from './UserAssetsTab'
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
      ...UserStudiesTab_user
    }
  }
`

class UserPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tab: this._tab,
    }
  }

  componentDidUpdate(prevProps) {
    const prevQuery = queryString.parse(get(prevProps, "location.search", ""))
    const newQuery = queryString.parse(get(this.props, "location.search", ""))
    const prevTab = get(prevQuery, "tab", "")
    const newTab = get(newQuery, "tab", "")

    if (prevTab !== newTab) {
      this.setState({tab: this._tab})
    }
  }

  get _tab() {
    const query = queryString.parse(get(this.props, "location.search", ""))
    const tab = get(query, "tab", "")
    return (() => {
      switch (tab.toLowerCase()) {
      case "apples":
        return UserApplesTab
      case "assets":
        return UserAssetsTab
      case "pupils":
        return UserPupilsTab
      case "studies":
        return UserStudiesTab
      case "tutors":
        return UserTutorsTab
      default:
        return UserOverviewTab
      }
    })()
  }

  get classes() {
    const {className} = this.props
    return cls("UserPage rn-page mdc-layout-grid", className)
  }

  render() {
    const {match} = this.props

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
            const Tab = this.state.tab
            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__inner">
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    <UserHeader user={props.user} />
                  </div>
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    <UserNav user={props.user} />
                  </div>
                  <Tab user={props.user} />
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
