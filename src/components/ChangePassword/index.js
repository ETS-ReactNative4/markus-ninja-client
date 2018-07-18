import React, {Component} from 'react'
import UpdateViewerAccountMutation from 'mutations/UpdateViewerAccountMutation'
import { isNil } from 'utils'

class ChangePassword extends Component {
  state = {
    confirmNewPassword: "",
    newPassword: "",
    oldPassword: "",
    error: null,
  }

  render() {
    const { confirmNewPassword, newPassword, oldPassword, error } = this.state
    return (
      <form className="ChangePassword" onSubmit={this.handleSubmit}>
        <label htmlFor="user_old_password">Old password</label>
        <input
          id="user_old_password"
          className="form-control"
          type="password"
          name="oldPassword"
          value={oldPassword}
          onChange={this.handleChange}
        />
        <label htmlFor="user_new_password">New password</label>
        <input
          id="user_new_password"
          className="form-control"
          type="password"
          name="newPassword"
          value={newPassword}
          onChange={this.handleChange}
        />
        <label htmlFor="user_confirm_new_password">Confirm new password</label>
        <input
          id="user_confirm_new_password"
          className="form-control"
          type="password"
          name="confirm_new_password"
          value={confirmNewPassword}
          onChange={this.handleChange}
        />
        <button type="submit">
          Update password
        </button>
        <span>{error}</span>
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
