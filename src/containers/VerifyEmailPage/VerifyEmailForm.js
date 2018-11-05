import * as React from 'react'
import cls from 'classnames'
import { withRouter } from 'react-router'
import TextField, {defaultTextFieldState} from 'components/TextField'
import RequestEmailVerificationMutation from 'mutations/RequestEmailVerificationMutation'

import './styles.css'

class VerifyEmailForm extends React.Component {
  state = {
    error: null,
    email: defaultTextFieldState,
  }

  handleChange = (email) => {
    this.setState({
      email,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {email} = this.state
    RequestEmailVerificationMutation(
      email.value,
      (errors) => {
        if (errors) {
          this.setState({ error: errors[0].message })
          return
        }
      },
    )
  }

  isValidEmail(email) {
    return email.valid
  }

  get classes() {
    const {className} = this.props
    return cls("VerifyEmailForm mdc-layout-grid__inner", className)
  }

  get formValidForRequest() {
    const {email} = this.state
    return this.isValidEmail(email)
  }

  render() {
    return (
      <form className={this.classes} onSubmit={this.handleSubmit}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="w-100"
            label="Email"
            inputProps={{
              autoComplete: "off",
              type: "email",
              name: "email",
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
            Send verification mail
          </button>
        </div>
      </form>
    )
  }
}

export default withRouter(VerifyEmailForm)
