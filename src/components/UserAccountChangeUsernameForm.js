import React, {Component} from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import UpdateViewerAccountMutation from 'mutations/UpdateViewerAccountMutation'
import { get, isNil } from 'utils'

class UserAccountChangeUsernameForm extends Component {
  state = {
    error: null,
    open: false,
    username: get(this.props, "user.login", ""),
  }

  render() {
    const { username, error } = this.state
    return (
      <div className="UserAccountChangeUsername">
        <div className="UserAccountChangeUsername__info">
          <div>Changing your username can have unintended side effects.</div>
          <button
            className="btn"
            type="button"
            onClick={this.handleToggleOpen}
          >
            Change username
          </button>
        </div>
        <div className="UserAccountChangeUsername__form">
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="user_new_username">New username</label>
            <input
              id="user_new_username"
              className="form-control"
              type="text"
              name="username"
              value={username}
              onChange={this.handleChange}
            />
            <button type="submit">
              Change username
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
    const { username } = this.state
    UpdateViewerAccountMutation(
      username,
      null,
      null,
      (error) => {
        if (!isNil(error)) {
          this.setState({ error: error.message })
        }
      },
    )
  }

  handleToggleOpen = () => {
    this.setState({ open: !this.state.open })
  }
}

export default createFragmentContainer(UserAccountChangeUsernameForm, graphql`
  fragment UserAccountChangeUsernameForm_user on User {
    login
  }
`)
