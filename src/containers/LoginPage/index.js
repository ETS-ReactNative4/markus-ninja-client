import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import LoginForm from 'components/LoginForm'

import "./styles.css"

class LoginPage extends Component {
  render() {
    return (
      <div className="LoginPage">
        <div className="lp-header">
          <Link className="lp-logo" to="/">
            <FontAwesomeIcon
              icon={faHome}
              size="3x"
            />
          </Link>
          <h1 className="mdc-typography--headline5">Sign in to RkusNinja</h1>
        </div>
        <LoginForm className="mdc-card"/>
        <p className="lp-create-account mdc-card">
          <span>
            {`New here? `}
            <Link
              className="lp-signup link"
              to="/signup"
            >
              Create an account
            </Link>
          </span>
        </p>
      </div>
    )
  }
}

export default LoginPage
