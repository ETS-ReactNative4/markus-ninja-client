import React, {Component} from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
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
        <div className="Header__content mdc-top-app-bar__row">
          <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
            <Link className="mdc-top-app-bar__title" to="/">Home</Link>
            <SearchBar />
            <Link className="mdc-top-app-bar__title" to="/research">Research</Link>
          </section>
          <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
            {!authenticated &&
            <div className="mdc-top-app-bar__title">
              <LoginLink>Sign in</LoginLink>
              <span> or </span>
              <Link to="/signup">Sign up</Link>
            </div>}
            {authenticated &&
            <div className="mdc-top-app-bar__title">
              <Link to="/notifications">Notifications</Link>
              <Link to="/new">New study</Link>
              <Link to={get(this.props, "viewer.resourcePath", "")}>Your profile</Link>
              <Link to="/logout">Logout</Link>
              <Link to="/settings">Settings</Link>
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
