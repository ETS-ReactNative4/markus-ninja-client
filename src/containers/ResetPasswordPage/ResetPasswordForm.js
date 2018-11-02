import * as React from 'react'
import cls from 'classnames'
import { withRouter } from 'react-router'
import TextField, {Input, HelperText} from '@material/react-text-field'
import ResetPasswordMutation from 'mutations/ResetPasswordMutation'
import RequestPasswordResetMutation from 'mutations/RequestPasswordResetMutation'
import {isEmpty, isNil} from 'utils'

import './styles.css'

class ResetPasswordForm extends React.Component {
  state = {
    error: null,
    confirmNewPassword: "",
    email: "",
    newPassword: "",
    resetToken: "",
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleRequestPasswordReset = (e) => {
    e.preventDefault()
    const {email} = this.state
    RequestPasswordResetMutation(
      email,
      (errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
          return
        }
      },
    )
  }

  handleResetPassword = (e) => {
    e.preventDefault()
    const {confirmNewPassword, email, newPassword, resetToken} = this.state
    if (newPassword !== confirmNewPassword) {
      this.setState({ error: "passwords do not match" })
    } else {
      ResetPasswordMutation(
        email,
        newPassword,
        resetToken,
        (errors) => {
          if (!isNil(errors)) {
            this.setState({ error: errors[0].message })
            return
          }
          this.props.history.replace("/signin")
        },
      )
    }
  }

  isValidEmail(email) {
    return !isEmpty(email)
  }

  isValidPassword(password) {
    return !isEmpty(password)
  }

  get classes() {
    const {className} = this.props
    return cls("ResetPasswordForm mdc-layout-grid__inner", className)
  }

  get formValidForRequestPasswordReset() {
    const {email} = this.state
    return this.isValidEmail(email)
  }

  get formValidForResetPassword() {
    const {confirmNewPassword, newPassword, resetToken, email} = this.state
    return this.isValidPassword(confirmNewPassword) &&
      this.isValidPassword(newPassword) &&
      !isEmpty(resetToken) &&
      this.isValidEmail(email)
  }

  render() {
    const {confirmNewPassword, newPassword, resetToken, email} = this.state
    return (
      <form className={this.classes}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="w-100"
            outlined
            label="Email"
            helperText={<HelperText persistent>The email to which we send the token.</HelperText>}
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
            className="rn-form__input"
            outlined
            label="Reset token"
            helperText={<HelperText persistent>The token contained within the email.</HelperText>}
          >
            <Input
              name="resetToken"
              value={resetToken}
              onChange={this.handleChange}
            />
          </TextField>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="rn-form__input"
            outlined
            label="New password"
          >
            <Input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={this.handleChange}
            />
          </TextField>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="rn-form__input"
            outlined
            label="Confirm new password"
          >
            <Input
              type="password"
              name="confirmNewPassword"
              value={confirmNewPassword}
              onChange={this.handleChange}
            />
          </TextField>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <button
            className="mdc-button mdc-button--outlined w-100"
            type="button"
            disabled={!this.formValidForRequestPasswordReset}
            onClick={this.handleRequestPasswordReset}
          >
            Request password reset token
          </button>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <button
            className="mdc-button mdc-button--unelevated w-100"
            type="button"
            disabled={!this.formValidForResetPassword}
            onClick={this.handleResetPassword}
          >
            Reset password
          </button>
        </div>
      </form>
    )
  }
}

export default withRouter(ResetPasswordForm)
