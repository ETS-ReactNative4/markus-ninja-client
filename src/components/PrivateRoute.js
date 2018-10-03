import * as React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom'
import queryString from 'query-string'
import { get } from 'utils'

class PrivateRoute extends React.Component {
  render() {
    const {authenticated} = this.props
    const pathname = get(this.props, "location.pathname", "")
    const returnTo = queryString.stringify({ return_to: pathname })

    if (authenticated) {
      return <Route {...this.props} />
    } else {
      return <Redirect to={{pathname: "/login", search: returnTo }} />
    }
  }
}

PrivateRoute.propTypes = {
  authenticated: PropTypes.bool,
}

PrivateRoute.defaultProps = {
  authenticated: false,
}

export default PrivateRoute
