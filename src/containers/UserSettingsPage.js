import React, {Component} from 'react'
import { Route, Switch } from 'react-router-dom'
import UserSettingsNav from 'components/UserSettingsNav'
import UserSettingsProfilePage from 'containers/UserSettingsProfilePage'
import UserSettingsAccountPage from 'containers/UserSettingsAccountPage'
import UserSettingsEmailsPage from 'containers/UserSettingsEmailsPage'
import UserSettingsNotificationsPage from 'containers/UserSettingsNotificationsPage'

class UserSettingsPage extends Component {
  render() {
    return (
      <div className="UserSettingsPage">
        <UserSettingsNav />
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
    )
  }
}

export default UserSettingsPage
