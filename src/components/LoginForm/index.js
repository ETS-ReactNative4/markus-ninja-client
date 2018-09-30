import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import TextField, {Input} from '@material/react-text-field'
import LoginUserMutation from 'mutations/LoginUserMutation'
import {login} from 'auth'
import { get, isNil } from 'utils'

import './styles.css'

class LoginForm extends React.Component {
  state = {
    error: null,
    username: "",
    password: "",
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
        login(token.token)
        this.props.onLogin()
        const search = queryString.parse(get(this.props, "location.search", ""))
        const returnTo = get(search, "return_to", undefined)
        this.props.history.replace(returnTo || "/")
      },
    )
  }

  get classes() {
    const {className} = this.props
    return cls("LoginForm mdc-layout-grid__inner", className)
  }

  render() {
    const {username, password} = this.state
    return (
      <form
        className={this.classes}
        onSubmit={this.handleSubmit}
      >
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="w-100"
            outlined
            label="Username or email"
          >
            <Input
              name="username"
              value={username}
              onChange={this.handleChange}
            />
          </TextField>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="w-100"
            outlined
            label="Password"
          >
            <Input
              type="password"
              name="password"
              value={password}
              onChange={this.handleChange}
            />
          </TextField>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <button
            className="mdc-button mdc-button--unelevated w-100"
            type="submit"
          >
            Sign in
          </button>
        </div>
      </form>
    )
  }
}

LoginForm.propTypes = {
  onLogin: PropTypes.func,
}

LoginForm.defaultProps = {
  onLogin: () => {},
}

export default withRouter(LoginForm)
