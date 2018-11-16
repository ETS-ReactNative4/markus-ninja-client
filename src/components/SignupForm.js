import * as React from 'react'
import cls from 'classnames'
import {withRouter} from 'react-router-dom'
import {HelperText} from '@material/react-text-field'
import ErrorText from 'components/ErrorText'
import TextField, {defaultTextFieldState} from 'components/TextField'
import CreateUserMutation from 'mutations/CreateUserMutation'
import AppContext from 'containers/App/Context'
import {isEmpty} from 'utils'

class SignupForm extends React.Component {
  state = {
    error: null,
    email: defaultTextFieldState,
    username: defaultTextFieldState,
    password: defaultTextFieldState,
  }

  handleChange = (field) => {
    this.setState({
      [field.name]: field,
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
        if (errors) {
          const error = errors[0].message
          this.setState({error})
          return
        }

        const credentials = btoa(username.value + ":" + password.value)
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
          this.context.refetchViewer().then(() => {
            this.props.history.replace("/")
          })
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

    return !isEmpty(email.value) && email.valid &&
      !isEmpty(username.value) && username.valid &&
      !isEmpty(password.value) && password.valid
  }

  render() {
    const {email, error, password, username} = this.state
    return (
      <form
        className={this.classes}
        onSubmit={this.handleSubmit}
      >
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="w-100"
            label="Username"
            helperText={
              <HelperText persistent validation={!username.valid}>
                {username.valid
                ? "Your name by which other users will know you."
                : "Usernames must be less than 40 characters, and may only " +
                  "contain alphanumeric characters or hyphens. Cannot have " +
                  "multiple consecutive hyphens, and begin or end with a hyphen."}
              </HelperText>
            }
            inputProps={{
              name: "username",
              required: true,
              pattern: "^([a-zA-Z0-9]+-)*[a-zA-Z0-9]+$",
              maxLength: 39,
              onChange: this.handleChange,
            }}
          />
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="w-100"
            label="Email address"
            helperText={
              <HelperText persistent validation={!email.valid}>
                {email.valid
                ?  `Your primary email address for account related communication.
                    We will never share your email address with anyone.`
                : "Invalid email"}
              </HelperText>
            }
            inputProps={{
              type: "email",
              name: "email",
              required: true,
              onChange: this.handleChange,
            }}
          />
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="w-100"
            label="Password"
            helperText={
              <HelperText persistent validation={!password.valid}>
                Use at least one lowercase letter, one uppercase letter, and one numeral in a minimum of seven characters.
              </HelperText>
            }
            inputProps={{
              type: "password",
              name: "password",
              required: true,
              pattern: "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{7,255}$",
              minLength: 7,
              onChange: this.handleChange,
            }}
          />
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <button
            type="submit"
            className="mdc-button mdc-button--unelevated"
          >
            Create an account
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

SignupForm.contextType = AppContext

export default withRouter(SignupForm)
