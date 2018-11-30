import * as React from 'react'
import cls from 'classnames'
import {HelperText} from '@material/react-text-field'
import ErrorText from 'components/ErrorText'
import Snackbar from 'components/mdc/Snackbar'
import TextField, {defaultTextFieldState} from 'components/TextField'
import UpdateViewerAccountMutation from 'mutations/UpdateViewerAccountMutation'

const INFO_STAGE = 'info'
const FORM_STAGE = 'form'

const defaultState = {
  error: null,
  confirmNewPassword: defaultTextFieldState,
  newPassword: defaultTextFieldState,
  oldPassword: defaultTextFieldState,
  showSnackbar: false,
  stage: INFO_STAGE,
}

class ChangePassword extends React.Component {
  state = defaultState

  handleChange = (field) => {
    this.setState({
      error: null,
      [field.name]: field,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { confirmNewPassword, newPassword, oldPassword } = this.state
    if (newPassword.value !== confirmNewPassword.value) {
      this.setState({ error: "passwords do not match" })
    } else {
      UpdateViewerAccountMutation(
        null,
        newPassword.value,
        oldPassword.value,
        (viewer, errors) => {
          if (errors) {
            this.setState({ error: errors[0].message })
            return
          }
          this.setState({
            ...defaultState,
            showSnackbar: true,
          })
        },
      )
    }
  }

  handleChangeStage = (stage = INFO_STAGE) => {
    this.setState({ stage })
  }

  get classes() {
    const {className} = this.props
    return cls("ChangePassword mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const {showSnackbar, stage} = this.state

    return (
      <React.Fragment>
        <div className={this.classes}>
          {(() => {
            switch (stage) {
              case INFO_STAGE:
                return this.renderInfo()
              case FORM_STAGE:
                return this.renderForm()
              default:
                return null
            }
          })()}
        </div>
        <Snackbar
          show={showSnackbar}
          message="Password changed"
          actionHandler={() => {this.setState({showSnackbar: false})}}
          actionText="ok"
          handleHide={() => {this.setState({showSnackbar: false})}}
        />
      </React.Fragment>
    )
  }

  renderInfo() {
    return (
      <React.Fragment>
        <p>We recommend changing your password every few months.</p>
        <button
          className="mdc-button mdc-button--unelevated mt2"
          type="button"
          onClick={() => this.handleChangeStage(FORM_STAGE)}
        >
          Change password
        </button>
      </React.Fragment>
    )
  }

  renderForm() {
    const {error, newPassword} = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="mb1">
          <TextField
            className="rn-form__input"
            label="Old password"
            inputProps={{
              type: "password",
              name: "oldPassword",
              required: true,
              pattern: "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{7,255}$",
              minLength: 7,
              onChange: this.handleChange,
            }}
          />
        </div>
        <div className="mb1">
          <TextField
            className="rn-form__input"
            label="New password"
            helperText={
              <HelperText persistent validation={!newPassword.valid}>
                Use at least one lowercase letter, one uppercase letter, and one numeral in a minimum of seven characters.
              </HelperText>
            }
            inputProps={{
              type: "password",
              name: "newPassword",
              required: true,
              pattern: "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{7,255}$",
              minLength: 7,
              onChange: this.handleChange,
            }}
          />
        </div>
        <div className="mb1">
          <TextField
            className="rn-form__input"
            label="Confirm new password"
            inputProps={{
              type: "password",
              name: "confirmNewPassword",
              required: true,
              pattern: newPassword.value,
              onChange: this.handleChange,
            }}
          />
        </div>
        <div>
          <button
            className="mdc-button mdc-button--unelevated"
            type="submit"
          >
            Update password
          </button>
          <button
            type="button"
            className="mdc-button ml2"
            onClick={() => this.handleChangeStage(INFO_STAGE)}
          >
            Cancel
          </button>
        </div>
        <div className="mt2">
          <ErrorText error={error} />
        </div>
      </form>
    )
  }
}

export default ChangePassword
