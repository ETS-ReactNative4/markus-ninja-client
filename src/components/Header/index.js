import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { Link, withRouter } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import List from 'components/mdc/List'
import Icon from 'components/Icon'
import Logo from 'components/Logo'
import Menu, {Corner} from 'components/mdc/Menu'
import IconLink from 'components/IconLink'
import SearchBar from './SearchBar'
import {get, getHandleClickLink} from 'utils'
import AppContext from 'containers/App/Context'

import './styles.css'

class Header extends React.Component {
  headerElement_ = React.createRef()

  state = {
    anchorElement: null,
    menuOpen: false,
    searchBarOpen: false,
  }

  componentDidUpdate(prevProps, prevState) {
    const {searchBarOpen} = this.state
    if (!prevState.searchBarOpen && searchBarOpen) {
      document.addEventListener('click', this.handleClick_, false);
      document.body.classList.add("pointer")
    } else if (prevState.searchBarOpen && !searchBarOpen) {
      document.removeEventListener('click', this.handleClick_, false);
      document.body.classList.remove("pointer")
    }
  }

  componentWillUnmount() {
    if (this.state.searchBarOpen) {
      document.removeEventListener('click', this.handleClick_, false);
    }
  }

  setAnchorElement = (el) => {
    if (this.state.anchorElement) {
      return
    }
    this.setState({anchorElement: el})
  }

  handleClick_ = (e) => {
    const {searchBarOpen} = this.state
    if (searchBarOpen) {
      const headerElement = this.headerElement_ && this.headerElement_.current
      if (headerElement && !headerElement.contains(e.target)) {
        this.setState({searchBarOpen: false})
      }
    }
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
        <header className={this.classes} ref={this.headerElement_}>
          <div className="mdc-top-app-bar__row">
            <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
              <Link
                className="mdc-icon-button mdc-top-app-bar__navigation-icon"
                to="/"
                aria-label="Home"
                title="Home"
              >
                <Logo className="mdc-icon-button__icon" />
              </Link>
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
        <MediaQuery query="(max-width: 674px)">
          <div className="mdc-top-app-bar--fixed-adjust" />
        </MediaQuery>}
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
                <List.Item onClick={getHandleClickLink("/signin")}>
                  <List.Item.Graphic graphic={<Icon icon="person" />}/>
                  <List.Item.Text primaryText="Sign in" />
                </List.Item>
                <List.Item onClick={getHandleClickLink("/signup")}>
                  <List.Item.Graphic graphic={<Icon icon="person_add" />}/>
                  <List.Item.Text primaryText="Sign up" />
                </List.Item>
              </List>
            </Menu>
          </Menu.Anchor>
        </section>
        <section className="Header__auth-nav--spread mdc-top-app-bar__section mdc-top-app-bar__section--align-end">
          <IconLink
            className="mdc-top-app-bar__navigation-icon"
            to="/signin"
            aria-label="Sign in"
            title="Sign in"
          >
            person
          </IconLink>
          <IconLink
            className="mdc-top-app-bar__navigation-icon"
            to="/signup"
            aria-label="Sign up"
            title="Sign up"
          >
            person_add
          </IconLink>
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
                <List.Item onClick={getHandleClickLink("/notifications")}>
                  <List.Item.Graphic graphic={<Icon icon="notifications" />}/>
                  <List.Item.Text primaryText="Notifications" />
                </List.Item>
                <List.Item onClick={getHandleClickLink("/new")}>
                  <List.Item.Graphic graphic={<Icon icon="add" />}/>
                  <List.Item.Text primaryText="New study" />
                </List.Item>
                <List.Item onClick={getHandleClickLink(get(this.props, "viewer.resourcePath", ""))}>
                  <List.Item.Graphic graphic={<Icon icon="account_box" />}/>
                  <List.Item.Text primaryText="Profile" />
                </List.Item>
                <List.Item onClick={getHandleClickLink("/signout")}>
                  <List.Item.Graphic graphic={<Icon icon="power_settings_new" />}/>
                  <List.Item.Text primaryText="Sign out" />
                </List.Item>
                <List.Item onClick={getHandleClickLink("/settings")}>
                  <List.Item.Graphic graphic={<Icon icon="settings" />}/>
                  <List.Item.Text primaryText="Settings" />
                </List.Item>
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
            to="/signout"
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
