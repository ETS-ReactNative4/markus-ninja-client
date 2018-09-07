import React, {Component} from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import UserSettingsNav from './UserSettingsNav'
import ProfileSettings from './ProfileSettings'
import AccountSettings from './AccountSettings'
import EmailSettings from './EmailSettings'
// import NotificationSettings from './NotificationSettings'

import './styles.css'

class UserSettingsPage extends Component {
  render() {
    if (this.props.match.isExact) {
      return <Redirect to="/settings/profile" />
    }
    return (
      <div className="UserSettingsPage flex w-100">
        <UserSettingsNav />
        <div className="flex-auto">
          <Switch>
            <Route
              exact
              path="/settings/profile"
              component={ProfileSettings}
            />
            <Route
              exact
              path="/settings/account"
              component={AccountSettings}
            />
            <Route
              exact
              path="/settings/emails"
              component={EmailSettings}
            />
            {/*<Route
              exact
              path="/settings/notifications"
              component={NotificationSettings}
            />*/}
          </Switch>
        </div>
      </div>
    )
  }
}

export default UserSettingsPage
