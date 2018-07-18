import React, {Component} from 'react'
import { withRouter } from 'react-router-dom';
import DeleteViewerAccountMutation from 'mutations/DeleteViewerAccountMutation'
import { isEmpty, isNil } from 'utils'
import cls from 'classnames'

import './DeleteAccount.css'

class DeleteAccount extends Component {
  state = {
    error: null,
    open: false,
    password: "",
    login: "",
    verify: "",
  }

  render() {
    const { login, open, password, verify, error } = this.state
    const submittable =
      !isEmpty(login) &&
      !isEmpty(password) &&
      verify === 'delete my account'

    return (
      <div className={cls("DeleteAccount", {open})}>
        <div className="DeleteAccount__info">
          <div>Once you delete your account, there is no going back. Please be certain.</div>
          <div className="DeleteAccount__actions">
            <button
              className="btn"
              type="button"
              onClick={this.handleToggleOpen}
            >
              Delete your account
            </button>
          </div>
        </div>
        <div className="DeleteAccount__form">
          <div className="warning">This is extremely important.</div>
          <div>We will immediately delete all your studies, and anything associated with your account</div>
          <div>You will no longer receive any communication from us about your account.</div>
          <div>Please be sure before you proceed.</div>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="user_username_email">Your username or email</label>
            <input
              id="user_username_email"
              className="form-control"
              type="text"
              name="login"
              value={login}
              onChange={this.handleChange}
            />
            <label htmlFor="verify-delete">
              To verify, type <em>delete my account</em> below:
            </label>
            <input
              id="verify-delete"
              className="form-control"
              type="text"
              name="verify"
              value={verify}
              onChange={this.handleChange}
            />
            <label htmlFor="user_password">Confirm your password:</label>
            <input
              id="user_password"
              className="form-control"
              type="password"
              name="password"
              value={password}
              onChange={this.handleChange}
            />
            <button
              className="btn"
              disabled={!submittable}
              type="submit"
              onClick={this.handleSubmit}
            >
              Delete this account
            </button>
            <button
              className="btn-link"
              type="button"
              onClick={this.handleToggleOpen}
            >
              Cancel
            </button>
            <span>{error}</span>
          </form>
        </div>
      </div>
    )
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { login, password, verify } = this.state
    if (verify !== 'delete my account') {
      return
    } else {
      return DeleteViewerAccountMutation(
        login,
        password,
        (error) => {
          if (!isNil(error)) {
            this.setState({ error: error.message })
          }
          this.history.replace('/')
        },
      )
    }
  }

  handleToggleOpen = () => {
    this.setState({ open: !this.state.open })
  }
}

export default withRouter(DeleteAccount)
