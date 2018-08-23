import React, {Component} from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link, withRouter } from 'react-router-dom'
import IconLink from 'components/IconLink'
import { isAuthenticated } from 'auth'
import LoginLink from 'components/LoginLink'
import SearchBar from './SearchBar'
import { get } from 'utils'

import './styles.css'

class Header extends Component {
  render() {
    const authenticated = isAuthenticated()
    return (
      <header className="Header mdc-top-app-bar mdc-top-app-bar--fixed">
        <div className="mdc-top-app-bar__row">
          <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
            <IconLink
              className="mdc-top-app-bar__navigation-icon"
              to="/"
              aria-label="Home"
              title="Home"
            >
              home
            </IconLink>
            <SearchBar />
            <IconLink
              className="mdc-top-app-bar__action-item"
              to="/research"
              aria-label="Research"
              title="Research"
            >
              library_books
            </IconLink>
          </section>
          <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
            {!authenticated &&
            <div className="mdc-top-app-bar__title">
              <LoginLink className="rn-link rn-link__on-primary" aria-label="Sign in">Sign in</LoginLink>
              <span className="mdc-theme--text-hint-on-dark"> or </span>
              <Link className="rn-link rn-link__on-primary" to="/signup" aria-label="Sign up">Sign up</Link>
            </div>}
            {authenticated &&
            <div className="mdc-top-app-bar__title">
              <IconLink
                className="mdc-top-app-bar__navigation-icon"
                to="/notifications"
                aria-label="Notifications"
                title="Notifcations"
              >
                notifications
              </IconLink>
              <IconLink
                className="mdc-top-app-bar__navigation-icon"
                to="/new"
                aria-label="New study"
                title="New study"
              >
                add
              </IconLink>
              <IconLink
                className="mdc-top-app-bar__navigation-icon"
                to={get(this.props, "viewer.resourcePath", "")}
                aria-label="Account"
                title="Account"
              >
                account_box
              </IconLink>
              <IconLink
                className="mdc-top-app-bar__navigation-icon"
                to="/logout"
                aria-label="Logout"
                title="Logout"
              >
                power_settings_new
              </IconLink>
              <IconLink
                className="mdc-top-app-bar__navigation-icon"
                to="/settings"
                aria-label="Settings"
                title="Settings"
              >
                settings
              </IconLink>
            </div>}
          </section>
        </div>
      </header>
    )
  }
}

export default withRouter(createFragmentContainer(Header, graphql`
  fragment Header_viewer on User {
    resourcePath
  }
`))
