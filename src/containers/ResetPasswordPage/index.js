import * as React from 'react'
import cls from 'classnames'
import { Link } from 'react-router-dom'
import Logo from 'components/Logo'
import ResetPasswordForm from './ResetPasswordForm'

import "./styles.css"

class ResetPasswordPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("ResetPasswordPage mdc-layout-grid center mw6", className)
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
              <h5>Reset password</h5>
            </header>
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <div className="mdc-card pa4">
              <ResetPasswordForm />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ResetPasswordPage
