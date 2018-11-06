import * as React from 'react'
import { Redirect } from 'react-router-dom'
import AppContext from 'containers/App/Context'

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
      this.context.removeViewer()
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

LogoutPage.contextType = AppContext

export default LogoutPage
