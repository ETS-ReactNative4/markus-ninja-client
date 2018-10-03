import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {withRouter} from 'react-router-dom'
import TextField, {Input, HelperText} from '@material/react-text-field'
import CreateUserMutation from 'mutations/CreateUserMutation'
import {isNil} from 'utils'

class SignupForm extends React.Component {
  state = {
    error: null,
    email: "",
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
    const { email, username, password } = this.state
    CreateUserMutation(
      email,
      username,
      password,
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
              value={username}
              onChange={this.handleChange}
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
              name="email"
              value={email}
              onChange={this.handleChange}
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
              value={password}
              onChange={this.handleChange}
            />
          </TextField>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <button
            className="mdc-button mdc-button--unelevated"
            type="submit"
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
