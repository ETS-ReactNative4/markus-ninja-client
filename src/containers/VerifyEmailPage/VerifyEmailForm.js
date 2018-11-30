import * as React from 'react'
import cls from 'classnames'
import { withRouter } from 'react-router'
import Snackbar from 'components/mdc/Snackbar'
import TextField, {defaultTextFieldState} from 'components/TextField'
import RequestEmailVerificationMutation from 'mutations/RequestEmailVerificationMutation'

import './styles.css'

class VerifyEmailForm extends React.Component {
  state = {
    error: null,
    email: defaultTextFieldState,
    showSnackbar: false,
    snackbarMessage: "",
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
          this.setState({
            error: errors[0].message,
            showSnackbar: true,
            snackbarMessage: "Something went wrong",
          })
          return
        }
        this.setState({
          showSnackbar: true,
          snackbarMessage: "Verification sent",
        })
      },
    )
  }

  get classes() {
    const {className} = this.props
    return cls("VerifyEmailForm mdc-layout-grid__inner", className)
  }

  render() {
    const {showSnackbar, snackbarMessage} = this.state

    return (
      <React.Fragment>
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

export default withRouter(VerifyEmailForm)
