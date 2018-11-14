import * as React from 'react'
import cls from 'classnames'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
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
              <Link className="rn-link" to="/">
                <FontAwesomeIcon
                  icon={faHome}
                  size="3x"
                />
              </Link>
              <h5>Sign in to RkusNinja</h5>
            </header>
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <div className="mdc-card pa4">
              <LoginForm />
            </div>
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <p className="mdc-card pa3">
              <div>
                New here?
                <Link
                  className="rn-link ml1"
                  to="/signup"
                >
                  Create an account.
                </Link>
              </div>
              <div>
                <Link
                  className="rn-link"
                  to="/reset_password"
                >
                  Forgot your password?
                </Link>
              </div>
            </p>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginPage
