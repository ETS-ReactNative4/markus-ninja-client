import * as React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'

class LogoutPage extends React.Component {
  state = {
    loggedOut: false,
  }

  componentDidMount() {
    return fetch(process.env.REACT_APP_API_URL + "/remove_token", {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (!response.ok) {
        console.error("failed to logout")
        return
      }
      this.props.onLogout()
      this.setState({ loggedOut: true })
    })
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
