import React, {Component} from 'react'
import { withRouter } from 'react-router-dom';
import UpdateUserMutation from 'mutations/UpdateUserMutation'
import { get, isNil } from 'utils'
import cls from 'classnames'
import convert from 'htmr'

import './UserBio.css'

class UserBio extends Component {
  state = {
    error: null,
    open: false,
    bio: this.props.user.bio,
  }

  render() {
    const user = get(this.props, "user", {})
    const { error, open, bio } = this.state
    return (
      <div className={cls("UserBio", {open})}>
        <div className="UserBio__show">
          <h1 className="UserBio__bio">
            <span className="UserBio__user-bio">{convert(user.bioHTML)}</span>
          </h1>
          <div className="UserBio__actions">
            <button
              className="btn"
              type="button"
              onClick={this.handleToggleOpen}
            >
              Edit bio
            </button>
          </div>
        </div>
        <div className="UserBio__edit">
          <form onSubmit={this.handleSubmit}>
            <input
              id="user-bio"
              className={cls("form-control", "edit-user-bio")}
              type="text"
              name="bio"
              placeholder="Add a bio"
              value={bio}
              onChange={this.handleChange}
            />
            <button
              className="btn"
              type="submit"
              onClick={this.handleSubmit}
            >
              Save
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
    const { bio } = this.state
    UpdateUserMutation(
      this.props.user.id,
      bio,
      null,
      (error) => {
        if (!isNil(error)) {
          this.setState({ error: error.message })
        }
        this.handleToggleOpen()
      },
    )
  }

  handleToggleOpen = () => {
    this.setState({ open: !this.state.open })
  }
}

export default withRouter(UserBio)
