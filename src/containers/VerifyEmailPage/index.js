import * as React from 'react'
import cls from 'classnames'
import { Link } from 'react-router-dom'
import Logo from 'components/Logo'
import VerifyEmailForm from './VerifyEmailForm'

import "./styles.css"

class VerifyEmailPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("VerifyEmailPage mdc-layout-grid center mw6", className)
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
              <h5>Verify email</h5>
            </header>
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <div className="mdc-card pa4">
              <VerifyEmailForm />
            </div>
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <p className="mdc-card pa3">
              <span>
                You must have at least one verified email to use this site.
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

export default VerifyEmailPage
