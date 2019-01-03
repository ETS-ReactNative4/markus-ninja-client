import * as React from 'react'
import cls from 'classnames'
import { Link } from 'react-router-dom'
import Logo from 'components/Logo'
import LoginForm from 'components/LoginForm'

import "./styles.css"

class LoginPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("LoginPage mdc-layout-grid center mw6", className)
  }

  render() {
    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__inner">
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <header className="pt3 pb2 tc">
              <Link className="mdc-icon-button mdc-icon-button--large" to="/">
                <Logo className="mdc-icon-button__icon" />
              </Link>
              <h5>Sign in</h5>
            </header>
          </div>
          <LoginForm />
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <div className="mdc-card pa3">
              <p className="mb1">
                New here?
                <Link
                  className="rn-link ml1"
                  to="/signup"
                >
                  Create an account.
                </Link>
              </p>
              <p>
                Forgot your password?
                <Link
                  className="rn-link rn-link--underlined ml1"
                  to="/reset_password"
                >
                  Click here.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginPage
