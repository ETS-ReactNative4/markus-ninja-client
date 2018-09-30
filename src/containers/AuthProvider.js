import * as React from 'react'
import {Route, Switch} from 'react-router-dom'
import LoginPage from 'containers/LoginPage'
import LogoutPage from 'containers/LogoutPage'
import ResetPasswordPage from 'containers/ResetPasswordPage'
import VerifyEmailPage from 'containers/VerifyEmailPage'
import {isAuthenticated} from 'auth'

class AuthProvider extends React.Component {
  state = {
    authenticated: isAuthenticated(),
  }

  handleLogin = () => {
    this.setState({authenticated: true})
  }

  handleLogout = () => {
    this.setState({authenticated: false})
  }

  render() {
    const {authenticated} = this.state

    return (
      <Switch>
        <Route
          exact
          path="/login"
          render={() => <LoginPage onLogin={this.handleLogin} />}
        />
        <Route
          exact
          path="/logout"
          render={() => <LogoutPage onLogout={this.handleLogout} />}
        />
        <Route exact path="/reset_password" component={ResetPasswordPage} />
        <Route exact path="/verify_email" component={VerifyEmailPage} />
        <Route render={() => {
          const child = React.Children.only(this.props.children)
          return React.cloneElement(child, {authenticated})
        }}/>
      </Switch>
    )
  }
}

export default AuthProvider
