import * as React from 'react'
import cls from 'classnames'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
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
              <Link className="rn-link" to="/">
                <FontAwesomeIcon
                  icon={faHome}
                  size="3x"
                />
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
                  to="/logout"
                >
                  logout
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
