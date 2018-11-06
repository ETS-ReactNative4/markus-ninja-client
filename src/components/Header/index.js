import React, {Component} from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link, withRouter } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import List from 'components/List'
import Menu, {Corner} from 'components/mdc/Menu'
import IconLink from 'components/IconLink'
import LoginLink from 'components/LoginLink'
import SearchBar from './SearchBar'
import {get} from 'utils'
import AppContext from 'containers/App/Context'

import './styles.css'

class Header extends Component {
  state = {
    anchorElement: null,
    menuOpen: false,
    searchBarOpen: false,
  }

  setAnchorElement = (el) => {
    if (this.state.anchorElement) {
      return
    }
    this.setState({anchorElement: el})
  }

  get classes() {
    const {className} = this.props
    const {searchBarOpen} = this.state
    return cls("Header mdc-top-app-bar mdc-top-app-bar--fixed", className, {
      open: searchBarOpen,
    })
  }

  render() {
    const authenticated = this.context.isAuthenticated()
    const {searchBarOpen} = this.state

    return (
      <React.Fragment>
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
                  onClick={() => this.setState({searchBarOpen: !searchBarOpen})}
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
            {!authenticated && this.renderUnauthLinks()}
            {authenticated && this.renderAuthLinks()}
          </div>
          <MediaQuery query="(max-width: 674px)">
            <div className="Header__search-row">
              <div className="mdc-top-app-bar__row">
                <SearchBar className="w-100 mh2" />
              </div>
            </div>
          </MediaQuery>
        </header>
        {searchBarOpen &&
        <div className="mdc-top-app-bar--fixed-adjust" />}
      </React.Fragment>
    )
  }

  renderUnauthLinks() {
    const {anchorElement, menuOpen} = this.state

    return (
      <React.Fragment>
        <section className="Header__auth-nav--collapsed mdc-top-app-bar__section mdc-top-app-bar__section--align-end">
          <Menu.Anchor innerRef={this.setAnchorElement}>
            <button
              type="button"
              className="material-icons mdc-top-app-bar__navigation-icon"
              onClick={() => this.setState({menuOpen: !menuOpen})}
            >
              menu
            </button>
            <Menu
              open={menuOpen}
              fixed={true}
              onClose={() => this.setState({menuOpen: false})}
              anchorElement={anchorElement}
              anchorCorner={Corner.BOTTOM_LEFT}
            >
              <List>
                <Link className="mdc-list-item" to="/signin">
                  <span className="material-icons mdc-list-item__graphic">exit_to_app</span>
                  <span className="mdc-list-item__text">Sign in</span>
                </Link>
                <Link className="mdc-list-item" to="/signup">
                  <span className="material-icons mdc-list-item__graphic">person_add</span>
                  <span className="mdc-list-item__text">Sign up</span>
                </Link>
              </List>
            </Menu>
          </Menu.Anchor>
        </section>
        <section className="Header__auth-nav--spread mdc-top-app-bar__section mdc-top-app-bar__section--align-end">
          <div className="mdc-top-app-bar__title">
            <LoginLink className="rn-link rn-link--undecorated rn-link--on-primary" aria-label="Sign in">Sign in</LoginLink>
            <span className="mdc-theme--text-hint-on-dark"> or </span>
            <Link className="rn-link rn-link--undecorated rn-link--on-primary" to="/signup" aria-label="Sign up">Sign up</Link>
          </div>
        </section>
      </React.Fragment>
    )
  }

  renderAuthLinks() {
    const {anchorElement, menuOpen} = this.state

    return (
      <React.Fragment>
        <section className="Header__auth-nav--collapsed mdc-top-app-bar__section mdc-top-app-bar__section--align-end">
          <Menu.Anchor innerRef={this.setAnchorElement}>
            <button
              type="button"
              className="material-icons mdc-top-app-bar__navigation-icon"
              onClick={() => this.setState({menuOpen: !menuOpen})}
            >
              menu
            </button>
            <Menu
              open={menuOpen}
              fixed={true}
              onClose={() => this.setState({menuOpen: false})}
              anchorElement={anchorElement}
              anchorCorner={Corner.BOTTOM_LEFT}
            >
              <List>
                <Link className="mdc-list-item" to="/notifications">
                  <span className="material-icons mdc-list-item__graphic">notifications</span>
                  <span className="mdc-list-item__text">Notifications</span>
                </Link>
                <Link className="mdc-list-item" to="/new">
                  <span className="material-icons mdc-list-item__graphic">add</span>
                  <span className="mdc-list-item__text">New study</span>
                </Link>
                <Link className="mdc-list-item" to={get(this.props, "viewer.resourcePath", "")}>
                  <span className="material-icons mdc-list-item__graphic">account_box</span>
                  <span className="mdc-list-item__text">Profile</span>
                </Link>
                <Link className="mdc-list-item" to="/logout">
                  <span className="material-icons mdc-list-item__graphic">power_settings_new</span>
                  <span className="mdc-list-item__text">Sign out</span>
                </Link>
                <Link className="mdc-list-item" to="/settings">
                  <span className="material-icons mdc-list-item__graphic">settings</span>
                  <span className="mdc-list-item__text">Settings</span>
                </Link>
              </List>
            </Menu>
          </Menu.Anchor>
        </section>
        <section className="Header__auth-nav--spread mdc-top-app-bar__section mdc-top-app-bar__section--align-end">
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
            aria-label="Profile"
            title="Profile"
          >
            account_box
          </IconLink>
          <IconLink
            className="mdc-top-app-bar__navigation-icon"
            to="/logout"
            aria-label="Sign out"
            title="Sign out"
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
        </section>
      </React.Fragment>
    )
  }
}

Header.contextType = AppContext

export default withRouter(createFragmentContainer(Header, graphql`
  fragment Header_viewer on User {
    resourcePath
  }
`))
