import * as React from 'react'
import { Redirect, Route } from 'react-router-dom'
import queryString from 'query-string'
import { isAuthenticated } from 'auth'
import { get } from 'utils'

class PrivateRoute extends React.Component {
  render() {
    const { component: Component, ...rest } = this.props
    const pathname = get(this.props, "location.pathname", "")
    const returnTo = queryString.stringify({ return_to: pathname })
    return (
      <Route
        {...rest}
        render={props => {
          if (isAuthenticated()) {
            return <Component {...props} />
          } else {
            return <Redirect to={{pathname: "/login", search: returnTo }} />
          }
        }}
      />
    )
  }
}

export default PrivateRoute
