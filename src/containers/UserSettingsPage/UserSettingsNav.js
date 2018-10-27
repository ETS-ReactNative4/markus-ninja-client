import * as React from 'react'
import {matchPath, withRouter} from 'react-router-dom'
import Tab from 'components/mdc/Tab'
import TabBar from 'components/mdc/TabBar'
import { get } from 'utils'

import './styles.css'

const SETTINGS_PATH = "/settings"

class UserSettingsNav extends React.Component {
  isPathActive = (path) => {
    const pathname = get(this.props, "location.pathname", "")
    const match = matchPath(pathname, { path, exact: true })
    return Boolean(match && match.isExact)
  }

  handleClickTab_ = (e) => {
    this.props.history.push(e.target.value)
  }

  render() {
    const {className} = this.props
    const profilePath = SETTINGS_PATH+"/profile"
    const accountPath = SETTINGS_PATH+"/account"
    const emailsPath = SETTINGS_PATH+"/emails"

    return (
      <TabBar className={className} onClickTab={this.handleClickTab_}>
        <Tab
          active={this.isPathActive(profilePath)}
          minWidth
          value={profilePath}
        >
          <span className="mdc-tab__icon material-icons">person</span>
          <span className="mdc-tab__text-label">Profile</span>
        </Tab>
        <Tab
          active={this.isPathActive(accountPath)}
          minWidth
          value={accountPath}
        >
          <span className="mdc-tab__icon material-icons">account_box</span>
          <span className="mdc-tab__text-label">Account</span>
        </Tab>
        <Tab
          active={this.isPathActive(emailsPath)}
          minWidth
          value={emailsPath}
        >
          <span className="mdc-tab__icon material-icons">email</span>
          <span className="mdc-tab__text-label">Emails</span>
        </Tab>
      </TabBar>
    )
  }
}

export default withRouter(UserSettingsNav)
