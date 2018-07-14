import React, {Component} from 'react'
import CreateUserMutation from 'mutations/CreateUserMutation'

class SignupForm extends Component {
  state = {
    error: null,
    email: "",
    username: "",
    password: "",
  }

  render() {
    const { email, username, password, error } = this.state
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="SignupForm__email">Email</label>
        <input
          id="SignupForm__email"
          type="email"
          name="email"
          value={email}
          onChange={this.handleChange}
        />
        <label htmlFor="SignupForm__username">Username</label>
        <input
          id="SignupForm__username"
          type="text"
          name="username"
          value={username}
          onChange={this.handleChange}
        />
        <label htmlFor="SignupForm__password">Password</label>
        <input
          id="SignupForm__password"
          type="password"
          name="password"
          value={password}
          onChange={this.handleChange}
        />
        <button type="submit">Signup</button>
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
    const { email, username, password } = this.state
    CreateUserMutation(email, username, password, (token, error) => {
      if (error !== null) {
        this.setState({ error: error.message })
      }
      window.sessionStorage.setItem("access_token", token.token)
      this.props.history.push("/")
    })
  }
}

export default SignupForm
