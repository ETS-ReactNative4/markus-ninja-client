import * as React from 'react'
import PropTypes from 'prop-types'
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
        this.props.onLogout()
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

LogoutPage.propTypes = {
  onLogout: PropTypes.func,
}

LogoutPage.defaultProps = {
  onLogout: () => {},
}

export default LogoutPage
