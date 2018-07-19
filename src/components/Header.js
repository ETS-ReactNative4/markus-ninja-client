import React, {Component} from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { isAuthenticated } from 'auth'
import { get } from 'utils'

class Header extends Component {
  render() {
    const authenticated = isAuthenticated()
    const viewer = get(this.props, "viewer", {})
    return (
      <div className="Header">
        <div className="Header__links">
          <Link className="Header__link" to="/">Home</Link>
          {authenticated &&
          <Link className="Header__link" to="/new">New study</Link>}
          {authenticated &&
          <Link className="Header__link" to={viewer.resourcePath}>Your profile</Link>}
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

export default withRouter(createFragmentContainer(Header, graphql`
  fragment Header_viewer on User {
    id
    login
    resourcePath
  }
`))
