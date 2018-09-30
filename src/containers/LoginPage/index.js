import * as React from 'react'
import PropTypes from 'prop-types'
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
              <h1 className="mdc-typography--headline5">Sign in to RkusNinja</h1>
            </header>
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <div className="mdc-card pa4">
              <LoginForm onLogin={this.props.onLogin} />
            </div>
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <p className="mdc-card pa3">
              <span>
                New here?
                <Link
                  className="rn-link ml1"
                  to="/signup"
                >
                  Create an account
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    )
  }
}

LoginPage.propTypes = {
  onLogin: PropTypes.func,
}

LoginPage.defaultProps = {
  onLogin: () => {},
}

export default LoginPage
