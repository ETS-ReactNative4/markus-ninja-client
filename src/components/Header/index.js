import React, {Component} from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link, withRouter } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import IconLink from 'components/IconLink'
import { isAuthenticated } from 'auth'
import LoginLink from 'components/LoginLink'
import SearchBar from './SearchBar'
import { get } from 'utils'

import './styles.css'

class Header extends Component {
  state = {
    open: false,
  }

  get classes() {
    const {className} = this.props
    const {open} = this.state
    return cls("Header mdc-top-app-bar mdc-top-app-bar--fixed", className, {
      open,
    })
  }

  render() {
    const authenticated = isAuthenticated()
    const {open} = this.state
    return (
      <header className={this.classes}>
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
            <MediaQuery query="(max-width: 674px)">
              <div
                className="material-icons mdc-top-app-bar__action-item"
                aria-label="Search"
                title="Search"
                onClick={() => this.setState({open: !open})}
              >
                search
              </div>
            </MediaQuery>
            <MediaQuery query="(min-width: 675px)">
              <SearchBar className="mh2" />
            </MediaQuery>
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
              <LoginLink className="rn-link rn-link--undecorated rn-link--on-primary" aria-label="Sign in">Sign in</LoginLink>
              <span className="mdc-theme--text-hint-on-dark"> or </span>
              <Link className="rn-link rn-link--undecorated rn-link--on-primary" to="/signup" aria-label="Sign up">Sign up</Link>
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
        <MediaQuery query="(max-width: 479px)">
          <div className="Header__search-row">
            <div className="mdc-top-app-bar__row">
              <SearchBar className="w-100 mh2" />
            </div>
          </div>
        </MediaQuery>
      </header>
    )
  }
}

export default withRouter(createFragmentContainer(Header, graphql`
  fragment Header_viewer on User {
    resourcePath
  }
`))
