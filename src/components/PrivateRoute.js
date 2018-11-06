import * as React from 'react'
import { Redirect, Route } from 'react-router-dom'
import queryString from 'query-string'
import { get } from 'utils'
import Context from 'containers/App/Context'

class PrivateRoute extends React.Component {
  render() {
    const pathname = get(this.props, "location.pathname", "")
    const returnTo = queryString.stringify({ return_to: pathname })

    if (this.context.isAuthenticated()) {
      return <Route {...this.props} />
    } else {
      return <Redirect to={{pathname: "/signin", search: returnTo }} />
    }
  }
}

PrivateRoute.contextType = Context

export default PrivateRoute
