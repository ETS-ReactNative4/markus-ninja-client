import React, {Component} from 'react'
import { withRouter } from 'react-router'
import LoginUserMutation from 'mutations/LoginUserMutation'
import { isNil } from 'utils'

class LoginForm extends Component {
  state = {
    error: null,
    username: "",
    password: "",
  }

  render() {
    const { username, password, error } = this.state
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="LoginForm__username">Username</label>
        <input
          id="LoginForm__username"
          type="text"
          name="username"
          value={username}
          onChange={this.handleChange}
        />
        <label htmlFor="LoginForm__password">Password</label>
        <input
          id="LoginForm__password"
          type="password"
          name="password"
          value={password}
          onChange={this.handleChange}
        />
        <button type="submit">Login</button>
        <span>{error}</span>
      </form>
    )
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { username, password } = this.state
    LoginUserMutation(
      username,
      password,
      (token, error) => {
        if (!isNil(error)) {
          this.setState({ error: error[0].message })
          return
        }
        window.sessionStorage.setItem("access_token", token.token)
        this.props.history.replace("/")
      },
    )
  }
}

export default withRouter(LoginForm)
