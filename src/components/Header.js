import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'


class Header extends Component {
  render() {
    return (
      <div className="Header">
        <div className="Header__links">
          <span className="Header__text">Markus Ninja</span>
          <Link className="Header__link" to="/">Home</Link>
          <span className="Header__link-divider">|</span>
          <Link className="Header__link" to="/new">New study</Link>
          <span className="Header__link-divider">|</span>
          <Link className="Header__link" to="/login">Login</Link>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
