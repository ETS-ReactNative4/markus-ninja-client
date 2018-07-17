import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './UserSettingsNav.css'

const SETTINGS_PATH = "/settings"

class UserSettingsNav extends Component {
  render() {
    return (
      <nav className="UserSettingsNav">
        <h3 className="UserSettingsNav__header">User Settings</h3>
        <Link
          className="UserSettingsNav__item"
          to={SETTINGS_PATH + "/profile"}
        >
          Profile
        </Link>
        <Link
          className="UserSettingsNav__item"
          to={SETTINGS_PATH + "/account"}
        >
          Account
        </Link>
        <Link
          className="UserSettingsNav__item"
          to={SETTINGS_PATH + "/emails"}
        >
          Emails
        </Link>
        <Link
          className="UserSettingsNav__item"
          to={SETTINGS_PATH + "/notifications"}
        >
          Notifications
        </Link>
      </nav>
    )
  }
}

export default UserSettingsNav
