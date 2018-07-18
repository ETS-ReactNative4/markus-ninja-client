import React, {Component} from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import UpdateViewerAccountMutation from 'mutations/UpdateViewerAccountMutation'
import { get, isNil } from 'utils'
import cls from 'classnames'

import './ChangeUsername.css'

const INFO_STAGE = 'info'
const AGREEMENT_STAGE = 'agreement'
const FORM_STAGE = 'form'

class ChangeUsername extends Component {
  state = {
    error: null,
    stage: INFO_STAGE,
    username: get(this.props, "user.login", ""),
  }

  render() {
    const { stage, username, error } = this.state
    return (
      <div className={cls("ChangeUsername", {[stage]: true})}>
        <div className="ChangeUsername__info">
          <div>Changing your username can have unintended side effects.</div>
          <button
            className="btn"
            type="button"
            onClick={() => this.handleChangeStage(AGREEMENT_STAGE)}
          >
            Change username
          </button>
        </div>
        <div className="ChangeUsername__agreement">
          <h3>Are you sure you want to change your username?</h3>
          <div className="warning">
            <span>This will result in unexpected behavior if you don't read this!</span>
          </div>
          <ul>
            <li>All previous links to your profile/studies <b>will not</b> go to your respective page.</li>
            <li>If someone takes your old username, then all previous links will direct to them.</li>
          </ul>
          <button
            className="btn"
            type="button"
            onClick={() => this.handleChangeStage(FORM_STAGE)}
          >
            I understand, change my username
          </button>
          <button
            className="btn-link"
            type="button"
            onClick={() => this.handleChangeStage(INFO_STAGE)}
          >
            Cancel
          </button>
        </div>
        <div className="ChangeUsername__form">
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
            <button
              className="btn-link"
              type="button"
              onClick={() => this.handleChangeStage(INFO_STAGE)}
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

  handleChangeStage = (stage = INFO_STAGE) => {
    this.setState({ stage })
  }
}

export default createFragmentContainer(ChangeUsername, graphql`
  fragment ChangeUsername_user on User {
    login
  }
`)
