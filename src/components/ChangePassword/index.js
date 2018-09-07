import * as React from 'react'
import cls from 'classnames'
import TextField, {Input} from '@material/react-text-field'
import UpdateViewerAccountMutation from 'mutations/UpdateViewerAccountMutation'
import { isNil } from 'utils'

class ChangePassword extends React.Component {
  state = {
    confirmNewPassword: "",
    newPassword: "",
    oldPassword: "",
    error: null,
  }

  get classes() {
    const {className} = this.props
    return cls("ChangePassword mdc-layout-grid__inner", className)
  }

  render() {
    const {confirmNewPassword, newPassword, oldPassword} = this.state
    return (
      <form className={this.classes} onSubmit={this.handleSubmit}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="w-100"
            outlined
            label="Old password"
          >
            <Input
              type="password"
              name="oldPassword"
              value={oldPassword}
              onChange={this.handleChange}
            />
          </TextField>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="w-100"
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
            className="w-100"
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
            className="mdc-button mdc-button--unelevated"
            type="submit"
          >
            Update password
          </button>
        </div>
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
}

export default ChangePassword
