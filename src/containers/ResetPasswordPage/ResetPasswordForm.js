import * as React from 'react'
import cls from 'classnames'
import { withRouter } from 'react-router'
import Snackbar from 'components/mdc/Snackbar'
import {HelperText} from '@material/react-text-field'
import TextField, {defaultTextFieldState} from 'components/TextField'
import ResetPasswordMutation from 'mutations/ResetPasswordMutation'
import RequestPasswordResetMutation from 'mutations/RequestPasswordResetMutation'
import {isEmpty} from 'utils'

import './styles.css'

class ResetPasswordForm extends React.Component {
  state = {
    error: null,
    confirmNewPassword: defaultTextFieldState,
    email: defaultTextFieldState,
    newPassword: defaultTextFieldState,
    resetToken: defaultTextFieldState,
    showSnackbar: false,
    snackbarMessage: "",
  }

  handleChange = (field) => {
    this.setState({
      [field.name]: field,
    })
  }

  handleRequestPasswordReset = (e) => {
    e.preventDefault()
    const {email} = this.state
    RequestPasswordResetMutation(
      email.value,
      (errors) => {
        if (errors) {
          this.setState({
            error: errors[0].message,
            showSnackbar: true,
            snackbarMessage: "Something went wrong",
          })
          return
        }
        this.setState({
          showSnackbar: true,
          snackbarMessage: "Request sent",
        })
      },
    )
  }

  handleResetPassword = (e) => {
    e.preventDefault()
    const {confirmNewPassword, email, newPassword, resetToken} = this.state
    if (newPassword.value !== confirmNewPassword.value) {
      this.setState({ error: "passwords do not match" })
    } else {
      ResetPasswordMutation(
        email.value,
        newPassword.value,
        resetToken.value,
        (errors) => {
          if (errors) {
            this.setState({
              error: errors[0].message,
              showSnackbar: true,
              snackbarMessage: "Something went wrong",
            })
            return
          }
          this.props.history.replace("/signin")
        },
      )
    }
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
    return !isEmpty(email.value) && email.valid
  }

  render() {
    const {showSnackbar, snackbarMessage} = this.state

    return (
      <React.Fragment>
        <form className={this.classes} onSubmit={this.handlePasswordReset}>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <TextField
              className="w-100"
              outlined
              label="Email"
              helperText={<HelperText persistent>The email to which we send the token.</HelperText>}
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
              className="rn-form__input"
              outlined
              label="Reset token"
              helperText={<HelperText persistent>The token contained within the email.</HelperText>}
              inputProps={{
                name: "resetToken",
                required: true,
                onChange: this.handleChange,
              }}
            />
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <TextField
              className="rn-form__input"
              outlined
              label="New password"
              inputProps={{
                type: "password",
                name: "newPassword",
                required: true,
                onChange: this.handleChange,
              }}
            />
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <TextField
              className="rn-form__input"
              outlined
              label="Confirm new password"
              inputProps={{
                type: "password",
                name: "confirmNewPassword",
                required: true,
                onChange: this.handleChange,
              }}
            />
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
              type="submit"
              className="mdc-button mdc-button--unelevated w-100"
            >
              Reset password
            </button>
          </div>
        </form>
        <Snackbar
          show={showSnackbar}
          message={snackbarMessage}
          actionHandler={() => this.setState({showSnackbar: false})}
          actionText="ok"
          handleHide={() => this.setState({showSnackbar: false})}
        />
      </React.Fragment>
    )
  }
}

export default withRouter(ResetPasswordForm)
