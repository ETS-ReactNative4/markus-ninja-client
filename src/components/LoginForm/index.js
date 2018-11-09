import * as React from 'react'
import cls from 'classnames'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import ErrorText from 'components/ErrorText'
import TextField, {defaultTextFieldState} from 'components/TextField'
import AppContext from 'containers/App/Context'
import {get, isEmpty} from 'utils'

import './styles.css'

class LoginForm extends React.Component {
  state = {
    error: null,
    username: defaultTextFieldState,
    password: defaultTextFieldState,
  }

  handleChange = (field) => {
    this.setState({
      error: null,
      [field.name]: field,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { username, password } = this.state
    const credentials = btoa(username.value + ":" + password.value)
    return fetch(process.env.REACT_APP_API_URL + "/token", {
      method: "GET",
      headers: {
        "Authorization": "Basic " + credentials,
      },
      credentials: "include",
    }).then((response) => {
      if (!response.ok) {
        return response.text()
      }
      return Promise.resolve()
    }).then((responseBody) => {
      if (responseBody) {
        try {
          const body = JSON.parse(responseBody)
          switch (body.error) {
            case "invalid_credentials":
              return this.setState({
                error: "Invalid credentials",
              })
            default:
              return this.setState({
                error: "An unknown error occurred",
              })
          }

        } catch (error) {
          console.error(error)
        }
      }

      this.context.refetchViewer().then(() => {
        const search = queryString.parse(get(this.props, "location.search", ""))
        const returnTo = get(search, "return_to", undefined)
        this.props.history.replace(returnTo || "/")
      })
    })
  }

  get classes() {
    const {className} = this.props
    return cls("LoginForm mdc-layout-grid__inner", className)
  }

  get formIsValid() {
    const {username, password} = this.state

    return !isEmpty(username.value) && username.valid &&
      !isEmpty(password.value) && password.valid
  }

  render() {
    const {error} = this.state
    return (
      <form
        className={this.classes}
        onSubmit={this.handleSubmit}
      >
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="w-100"
            label="Username or email"
            inputProps={{
              name: "username",
              required: true,
              maxLength: 39,
              onChange: this.handleChange,
            }}
          />
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="w-100"
            label="Password"
            inputProps={{
              type: "password",
              name: "password",
              required: true,
              onChange: this.handleChange,
            }}
          />
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <button
            type="submit"
            className="mdc-button mdc-button--unelevated w-100"
          >
            Sign in
          </button>
        </div>
        <ErrorText
          className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
          error={error}
        />
      </form>
    )
  }
}

LoginForm.contextType = AppContext

export default withRouter(LoginForm)
