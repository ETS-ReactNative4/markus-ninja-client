import * as React from 'react'
import cls from 'classnames'
import { Link, matchPath, withRouter } from 'react-router-dom'
import TabBar from 'components/TabBar'
import Tab from 'components/Tab'
import { get } from 'utils'

import './styles.css'

const SETTINGS_PATH = "/settings"

class UserSettingsNav extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("UserSettingsNav mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const pathname = get(this.props, "location.pathname", "")
    const profilePath = matchPath(pathname, { path: SETTINGS_PATH+"/profile", exact: true })
    const accountPath = matchPath(pathname, { path: SETTINGS_PATH+"/account", exact: true })
    const emailsPath = matchPath(pathname, { path: SETTINGS_PATH+"/emails", exact: true })
    // const notificationsPath = matchPath(pathname, { path: SETTINGS_PATH+"/notifications", exact: true })

    return (
      <TabBar className={this.classes}>
        <Tab
          active={profilePath && profilePath.isExact}
          minWidth
          as={Link}
          to={SETTINGS_PATH + "/profile"}
        >
          <span className="mdc-tab__content">
            <span className="mdc-tab__icon material-icons">person</span>
            <span className="mdc-tab__text-label">Profile</span>
          </span>
        </Tab>
        <Tab
          active={accountPath && accountPath.isExact}
          minWidth
          as={Link}
          to={SETTINGS_PATH + "/account"}
        >
          <span className="mdc-tab__content">
            <span className="mdc-tab__icon material-icons">account_box</span>
            <span className="mdc-tab__text-label">Account</span>
          </span>
        </Tab>
        <Tab
          active={emailsPath && emailsPath.isExact}
          minWidth
          as={Link}
          to={SETTINGS_PATH + "/emails"}
        >
          <span className="mdc-tab__content">
            <span className="mdc-tab__icon material-icons">email</span>
            <span className="mdc-tab__text-label">Emails</span>
          </span>
        </Tab>
      </TabBar>
    )
  }
}

export default withRouter(UserSettingsNav)
