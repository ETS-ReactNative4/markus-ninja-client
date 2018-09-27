import * as React from 'react'
import { Redirect } from 'react-router-dom'
import LogoutUserMutation from 'mutations/LogoutUserMutation'
import {logout} from 'auth'
import { isNil } from 'utils'

class LogoutPage extends React.Component {
  state = {
    loggedOut: false,
  }

  componentDidMount() {
    LogoutUserMutation(
      (error) => {
        if (!isNil(error)) {
          this.setState({ error: error[0].message })
          return
        }
        logout()
        this.setState({ loggedOut: true })
      },
    )
  }

  render() {
    if (this.state.loggedOut) {
      return <Redirect to="/" />
    }

    return null
  }
}

export default LogoutPage
