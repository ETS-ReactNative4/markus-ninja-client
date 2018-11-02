import * as React from 'react'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class LoginLink extends React.Component {
  render() {
    const { staticContext, ...props } = this.props
    const pathname = get(this.props, "location.pathname", "")
    const returnTo = queryString.stringify({ return_to: pathname })
    return (
      <Link
        {...props}
        to={{pathname: "/signin", search: returnTo }}
      >
        {this.props.children || "Sign in"}
      </Link>
    )
  }
}

export default withRouter(LoginLink)
