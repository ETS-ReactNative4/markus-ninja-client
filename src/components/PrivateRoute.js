import * as React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { isAuthenticated } from 'auth'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (isAuthenticated()) {
        return <Component {...props} />
      } else {
        return <Redirect to="/login" />
      }
    }}
  />
)

export default PrivateRoute
