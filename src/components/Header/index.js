import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { isAuthenticated } from 'auth'
import LoginLink from 'components/LoginLink'
import SearchBar from './SearchBar'
import AuthLinks from './AuthLinks'

import './Header.css'

class Header extends Component {
  render() {
    const authenticated = isAuthenticated()
    return (
      <div className="Header">
        <div className="Header__links">
          <Link className="link" to="/">Home</Link>
          <SearchBar />
          <Link className="link" to="/research">Research</Link>
          {!authenticated &&
          <ul>
            <li>
              <LoginLink>Login</LoginLink>
            </li>
            <li>
              <Link className="link" to="/signup">Signup</Link>
            </li>
          </ul>}
          {authenticated && <AuthLinks />}
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
