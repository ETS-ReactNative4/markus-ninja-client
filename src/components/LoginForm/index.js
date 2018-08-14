import React, {Component} from 'react'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import cls from 'classnames'
import { withUID } from 'components/UniqueId'
import LoginUserMutation from 'mutations/LoginUserMutation'
import { get, isNil } from 'utils'

import './styles.css'

class LoginForm extends Component {
  state = {
    error: null,
    username: "",
    password: "",
  }

  render() {
    const { className, uid } = this.props
    const { username, password, error } = this.state
    return (
      <form
        className={cls("LoginForm mdc-layout-grid", className)}
        onSubmit={this.handleSubmit}
      >
        <div className="mdc-layout-grid__inner">
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <div className="mdc-text-field mdc-text-field--fullwidth">
              <input type="text"
                className="mdc-text-field__input"
                id={`username-${uid}`}
                name="username"
                placeholder="Username or email"
                value={username}
                aria-label="Full-Width Text Field"
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <div className="mdc-text-field mdc-text-field--fullwidth">
              <input type="password"
                className="mdc-text-field__input"
                id={`password-${uid}`}
                name="password"
                placeholder="Password"
                value={password}
                aria-label="Full-Width Text Field"
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <button
              className="mdc-button lf-submit"
              type="submit"
            >
              Sign in
            </button>
          </div>
        </div>
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
        const search = queryString.parse(get(this.props, "location.search", ""))
        const returnTo = get(search, "return_to", undefined)
        this.props.history.replace(returnTo || "/")
      },
    )
  }
}

export default withUID((getUID) => ({ uid: getUID() }))(withRouter(LoginForm))
