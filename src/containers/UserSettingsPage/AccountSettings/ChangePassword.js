import * as React from 'react'
import cls from 'classnames'
import TextField, {Input} from '@material/react-text-field'
import UpdateViewerAccountMutation from 'mutations/UpdateViewerAccountMutation'
import { isNil } from 'utils'

const INFO_STAGE = 'info'
const FORM_STAGE = 'form'

class ChangePassword extends React.Component {
  state = {
    error: null,
    confirmNewPassword: "",
    newPassword: "",
    oldPassword: "",
    stage: INFO_STAGE,
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { confirmNewPassword, newPassword, oldPassword } = this.state
    if (newPassword !== confirmNewPassword) {
      this.setState({ error: "passwords do not match" })
    } else {
      return UpdateViewerAccountMutation(
        null,
        newPassword,
        oldPassword,
        (error) => {
          if (!isNil(error)) {
            this.setState({ error: error.message })
          }
        },
      )
    }
  }

  handleChangeStage = (stage = INFO_STAGE) => {
    this.setState({ stage })
  }

  get classes() {
    const {className} = this.props
    return cls("ChangePassword mdc-layout-grid__inner", className)
  }

  render() {
    const {stage} = this.state

    return (
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
    )
  }

  renderInfo() {
    return (
      <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <p>We recommend changing your password every few months.</p>
        <button
          className="mdc-button mdc-button--unelevated mt2"
          type="button"
          onClick={() => this.handleChangeStage(FORM_STAGE)}
        >
          Change password
        </button>
      </div>
    )
  }

  renderForm() {
    const {confirmNewPassword, newPassword, oldPassword} = this.state
    return (
      <form className={this.classes} onSubmit={this.handleSubmit}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="rn-form__input"
            label="Old password"
          >
            <Input
              type="password"
              name="oldPassword"
              value={oldPassword}
              required
              onChange={this.handleChange}
            />
          </TextField>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="rn-form__input"
            label="New password"
          >
            <Input
              type="password"
              name="newPassword"
              value={newPassword}
              required
              onChange={this.handleChange}
            />
          </TextField>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="rn-form__input"
            label="Confirm new password"
          >
            <Input
              type="password"
              name="confirmNewPassword"
              value={confirmNewPassword}
              required
              pattern={newPassword}
              onChange={this.handleChange}
            />
          </TextField>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
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
      </form>
    )
  }
}

export default ChangePassword
