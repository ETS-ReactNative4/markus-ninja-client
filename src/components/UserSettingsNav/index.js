import React, { Component } from 'react'
import { Link, matchPath, withRouter } from 'react-router-dom'
import ListItem from 'components/ListItem'
import { get } from 'utils'

import './styles.css'

const SETTINGS_PATH = "/settings"

class UserSettingsNav extends Component {
  render() {
    const pathname = get(this.props, "location.pathname", "")

    return (
      <aside className="UserSettingsNav mdc-drawer mdc-drawer--permanent mdc-typography">
        <div className="mdc-drawer___toolbar-spacer"></div>
        <nav className="mdc-drawer__drawer">
          <header className="mdc-drawer__header">
            <div className="mdc-drawer__header-content">
              <h3>
                User Settings
              </h3>
            </div>
          </header>
          <nav className="mdc-drawer__content mdc-list">
            <div role="separator" className="mdc-list-divider"></div>
            <ListItem
              active={matchPath(pathname, { path: SETTINGS_PATH+"/profile", exact: true })}
              as={Link}
              to={SETTINGS_PATH + "/profile"}
            >
              Profile
            </ListItem>
            <ListItem
              active={matchPath(pathname, { path: SETTINGS_PATH+"/account", exact: true })}
              as={Link}
              to={SETTINGS_PATH + "/account"}
            >
              Account
            </ListItem>
            <ListItem
              active={matchPath(pathname, { path: SETTINGS_PATH+"/emails", exact: true })}
              as={Link}
              to={SETTINGS_PATH + "/emails"}
            >
              Emails
            </ListItem>
            <ListItem
              active={matchPath(pathname, { path: SETTINGS_PATH+"/notifications", exact: true })}
              as={Link}
              to={SETTINGS_PATH + "/notifications"}
            >
              Notifications
            </ListItem>
          </nav>
        </nav>
      </aside>
    )
  }
}

export default withRouter(UserSettingsNav)
