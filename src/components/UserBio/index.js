import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router-dom';
import TextField, {Input} from '@material/react-text-field'
import UpdateViewerProfileMutation from 'mutations/UpdateViewerProfileMutation'
import HTML from 'components/HTML'
import { get, isEmpty, isNil } from 'utils'

import './styles.css'

class UserBio extends React.Component {
  state = {
    error: null,
    open: false,
    bio: this.props.user.bio,
  }

  get classes() {
    const {className} = this.props
    return cls("UserBio", className)
  }

  render() {
    const { className } = this.props
    const user = get(this.props, "user", {})
    const {open, bio} = this.state
    return (
      <div className={cls("UserBio", className, {open})}>
        {open
        ? <form onSubmit={this.handleSubmit}>
            <TextField
              className="w-100"
              label="Add a bio"
              textarea
              floatingLabelClassName={!isEmpty(bio) ? "mdc-floating-label--float-above" : ""}
            >
              <Input
                name="bio"
                value={bio}
                onChange={this.handleChange}
              />
            </TextField>
            <div className="inline-flex items-center mt2">
              <button
                className="mdc-button mdc-button--unelevated"
                type="submit"
                onClick={this.handleSubmit}
              >
                Save
              </button>
              <button
                className="mdc-button mdc-button--outlined ml2"
                type="button"
                onClick={this.handleToggleOpen}
              >
                Cancel
              </button>
            </div>
          </form>
        : <div className="UserBio__show">
            <HTML className="mb3" html={user.bioHTML} />
            <button
              className="mdc-button mdc-button--unelevated w-100"
              type="button"
              onClick={this.handleToggleOpen}
            >
              {isEmpty(user.bio) ? "Add a bio" : "Edit bio"}
            </button>
          </div>}
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
    UpdateViewerProfileMutation(
      bio,
      null,
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

export default withRouter(createFragmentContainer(UserBio, graphql`
  fragment UserBio_user on User {
    bio
    bioHTML
  }
`))
