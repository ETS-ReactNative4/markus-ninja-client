import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {withRouter} from 'react-router-dom'
import TextField, {Input, HelperText} from '@material/react-text-field'
import CreateUserMutation from 'mutations/CreateUserMutation'
import {isEmpty, isNil} from 'utils'

class SignupForm extends React.Component {
  state = {
    error: null,
    email: {
      dirty: false,
      value: "",
      visited: false,
    },
    username: {
      dirty: false,
      value: "",
      visited: false,
    },
    password: {
      dirty: false,
      value: "",
      visited: false,
    },
  }

  handleChange = (e) => {
    const name = e.target.name
    const field = this.state[name]
    const value = e.target.value
    this.setState({
      [name]: {
        ...field,
        dirty: true,
        value,
      }
    })
  }

  handleFocus = (e) => {
    const name = e.target.name
    const field = this.state[name]
    this.setState({
      [name]: {
        ...field,
        visited: true,
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { email, username, password } = this.state
    CreateUserMutation(
      email.value,
      username.value,
      password.value,
      (token, errors) => {
        if (!isNil(errors)) {
          console.error(errors[0].message)
        }

        const credentials = btoa(username + ":" + password)
        return fetch(process.env.REACT_APP_API_URL + "/token", {
          method: "GET",
          headers: {
            "Authorization": "Basic " + credentials,
          },
          credentials: "include",
        }).then((response) => {
          if (!response.ok) {
            console.error("failed to login")
            return
          }
          this.props.onLogin()
          this.props.history.replace("/")
        })
      }
    )
  }

  get classes() {
    const {className} = this.props
    return cls("SignupForm mdc-layout-grid__inner", className)
  }

  get formIsValid() {
    const {email, username, password} = this.state

    return !isEmpty(email.value) &&
      !isEmpty(username.value) &&
      !isEmpty(password.value)
  }

  render() {
    const {email, username, password} = this.state
    return (
      <form
        className={this.classes}
        onSubmit={this.handleSubmit}
      >
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="w-100"
            outlined
            label="Username"
            helperText={<HelperText persistent>Your name by which other users will know you.</HelperText>}
          >
            <Input
              name="username"
              value={username.value}
              required={username.visited}
              pattern="^([a-zA-Z0-9]+-)*[a-zA-Z0-9]+$"
              maxLength={39}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
            />
          </TextField>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="w-100"
            outlined
            label="Email address"
            helperText={
              <HelperText persistent>
                Your primary email address for account related communication.
                We will never share your email address with anyone.
              </HelperText>
            }
          >
            <Input
              type="email"
              name="email"
              value={email.value}
              required={email.visited}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
            />
          </TextField>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="w-100"
            outlined
            label="Password"
            helperText={
              <HelperText persistent>
                Use at least one lowercase letter, one numeral, and seven characters.
              </HelperText>
            }
          >
            <Input
              type="password"
              name="password"
              value={password.value}
              required={password.visited}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
            />
          </TextField>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <button
            type="submit"
            className="mdc-button mdc-button--unelevated"
            disabled={!this.formIsValid}
          >
            Create an account
          </button>
        </div>
      </form>
    )
  }
}

SignupForm.propTypes = {
  onLogin: PropTypes.func,
}

SignupForm.defaultProps = {
  onLogin: () => {},
}

export default withRouter(SignupForm)
