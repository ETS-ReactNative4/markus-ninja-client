import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {Link, Redirect} from 'react-router-dom'
import Logo from 'components/Logo'
import VerifyEmailForm from './VerifyEmailForm'
import {get} from 'utils'

import "./styles.css"

class VerifyEmailPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("VerifyEmailPage mdc-layout-grid center mw6", className)
  }

  render() {
    if (get(this.props, "viewer.isVerified", false)) {
      return <Redirect to="/" />
    }

    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__inner">
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <header className="pt3 pb2 tc">
              <Link className="mdc-icon-button mdc-icon-button--large" to="/">
                <Logo className="mdc-icon-button__icon" />
              </Link>
              <h5>Please verify your email</h5>
            </header>
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <div className="mdc-card pa4">
              <p className="mb3">
                Check your inbox for a message that contains a verification link.
                If you have not received one, then you may request a new message below.
                Use the same email you signed up with.
              </p>
              <VerifyEmailForm />
            </div>
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <p className="mdc-card pa3">
              <span>
                If you would like to do this later, please
                <Link
                  className="rn-link rn-link--underlined mh1"
                  to="/signout"
                >
                  Sign out
                </Link>
                to go back to the website.
              </span>
            </p>
          </div>
        </div>
      </div>
    )
  }
}

VerifyEmailPage.propTypes = {
  viewer: PropTypes.shape({
    isVerified: PropTypes.bool.isRequired,
  }).isRequired,
}

export default VerifyEmailPage
