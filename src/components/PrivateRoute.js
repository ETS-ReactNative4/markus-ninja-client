import * as React from 'react'
import { Redirect, Route } from 'react-router-dom'
import queryString from 'query-string'
import { isAuthenticated } from 'auth'
import { get } from 'utils'

class PrivateRoute extends React.Component {
  render() {
    const pathname = get(this.props, "location.pathname", "")
    const returnTo = queryString.stringify({ return_to: pathname })

    if (isAuthenticated()) {
      return <Route {...this.props} />
    } else {
      return <Redirect to={{pathname: "/login", search: returnTo }} />
    }
  }
}

export default PrivateRoute
