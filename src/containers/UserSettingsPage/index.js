import * as React from 'react'
import cls from 'classnames'
import { Redirect, Route, Switch } from 'react-router-dom'
import UserSettingsNav from './UserSettingsNav'
import ProfileSettings from './ProfileSettings'
import AccountSettings from './AccountSettings'
import EmailSettings from './EmailSettings'

import './styles.css'

class UserSettingsPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("UserSettingsPage mdc-layout-grid mw8", className)
  }

  render() {
    if (this.props.match.isExact) {
      return <Redirect to="/settings/profile" />
    }
    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__inner">
          <UserSettingsNav />
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
          </Switch>
        </div>
      </div>
    )
  }
}

export default UserSettingsPage
