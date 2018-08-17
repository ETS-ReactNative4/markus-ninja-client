import React, {Component} from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import UserSettingsNav from 'components/UserSettingsNav'
import UserSettingsProfilePage from 'containers/UserSettingsProfilePage'
import UserSettingsAccountPage from 'containers/UserSettingsAccountPage'
import UserSettingsEmailsPage from 'containers/UserSettingsEmailsPage'
import UserSettingsNotificationsPage from 'containers/UserSettingsNotificationsPage'

import './styles.css'

class UserSettingsPage extends Component {
  render() {
    if (this.props.match.isExact) {
      return <Redirect to="/settings/profile" />
    }
    return (
      <div className="UserSettingsPage inline-flex">
        <UserSettingsNav />
        <div className="UserSettingsPage__page">
          <Switch>
            <Route
              exact
              path="/settings/profile"
              component={UserSettingsProfilePage}
            />
            <Route
              exact
              path="/settings/account"
              component={UserSettingsAccountPage}
            />
            <Route
              exact
              path="/settings/emails"
              component={UserSettingsEmailsPage}
            />
            <Route
              exact
              path="/settings/notifications"
              component={UserSettingsNotificationsPage}
            />
          </Switch>
        </div>
      </div>
    )
  }
}

export default UserSettingsPage
