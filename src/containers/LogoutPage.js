import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { removeAccessToken } from 'auth'

class LogoutPage extends React.Component {
  render() {
    removeAccessToken()
    return (
      <Redirect to="/" />
    )
  }
}

export default LogoutPage
