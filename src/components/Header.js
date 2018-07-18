import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { isAuthenticated } from 'auth'

class Header extends Component {
  render() {
    const authenticated = isAuthenticated()
    return (
      <div className="Header">
        <div className="Header__links">
          <Link className="Header__link" to="/">Home</Link>
          <Link className="Header__link" to="/new">New study</Link>
          {!authenticated &&
          <Link className="Header__link" to="/login">Login</Link>}
          {authenticated &&
          <Link className="Header__link" to="/logout">Logout</Link>}
          {!authenticated &&
          <Link className="Header__link" to="/signup">Signup</Link>}
          {authenticated &&
          <Link className="Header__link" to="/settings">Settings</Link>}
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
