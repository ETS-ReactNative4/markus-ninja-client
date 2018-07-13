import React, {Component} from 'react'
import { withRouter } from 'react-router'
import LoginUserMutation from 'mutations/LoginUserMutation'

class LoginForm extends Component {
  state = {
    error: null,
    username: "",
    password: "",
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="LoginForm__username">Username</label>
        <input
          id="LoginForm__username"
          type="text"
          name="username"
          value={this.state.username}
          onChange={this.handleChange}
        />
        <label htmlFor="LoginForm__password">Password</label>
        <input
          id="LoginForm__password"
          type="password"
          name="password"
          value={this.state.password}
          onChange={this.handleChange}
        />
        <button type="submit">Login</button>
        <span>{this.state.error}</span>
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
    LoginUserMutation(username, password, (token, error) => {
      if (error !== null && error !== undefined) {
        this.setState({ error: error.message })
      }
      window.sessionStorage.setItem("access_token", token.token)
      this.props.history.push("/")
    })
  }
}

export default withRouter(LoginForm)
