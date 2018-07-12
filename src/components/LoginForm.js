import React, {Component} from 'react'

class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      username: "",
      password: "",
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit(e) {
    e.preventDefault()

    const type = "Basic"
    const credentials = btoa(this.state.username + ":" + this.state.password)
    return fetch("http://localhost:5000/token", {
      method: "Get",
      headers: {
        "Authorization": type + " " + credentials,
      },
    }).then(function (response) {
      return response.text()
    }).then(function (responseBody) {
      try {
        return JSON.parse(responseBody)
      } catch (error) {
        return responseBody
      }
    }).then((data) => {
      if (data.error) {
        this.setState({
          error: data.error_description,
        })
        return
      }
      window.sessionStorage.setItem("access_token", data.access_token)
      return
    })
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
}

export default LoginForm
