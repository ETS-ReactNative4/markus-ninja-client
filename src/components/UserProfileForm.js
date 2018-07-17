import React, {Component} from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import UpdateViewerProfileMutation from 'mutations/UpdateViewerProfileMutation'
import { get, isNil } from 'utils'

class UserProfileForm extends Component {
  state = {
    bio: this.props.user.bio,
    emailId: get(this.props, "user.email.id", ""),
    name: this.props.user.name,
    error: null,
  }

  render() {
    const { bio, emailId, name, error } = this.state
    const emailEdges = get(this.props, "user.emails.edges", [])
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="UserProfileForm__name">Name</label>
        <input
          id="UserProfileForm__name"
          type="text"
          name="name"
          value={name}
          onChange={this.handleChange}
        />
        <label htmlFor="UserProfileForm__email">Public email</label>
        <select
          id="UserProfileForm__email"
          name="emailId"
          value={emailId}
          onChange={this.handleChange}
        >
          <option value="">Select a verified email to display</option>
          {emailEdges.map(e =>
            <option key={e.node.id} value={e.node.id}>{e.node.value}</option>
          )}
        </select>
        <label htmlFor="UserProfileForm__bio">Bio</label>
        <input
          id="UserProfileForm__bio"
          type="select"
          name="bio"
          value={bio}
          onChange={this.handleChange}
        />
        <button type="submit">
          Update profile
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
    const { bio, emailId, name } = this.state
    UpdateViewerProfileMutation(
      bio,
      emailId,
      name,
      (error) => {
        if (!isNil(error)) {
          this.setState({ error: error.message })
        }
      },
    )
  }
}

export default createFragmentContainer(UserProfileForm, graphql`
  fragment UserProfileForm_user on User {
    id
    bio
    email {
      id
      value
    }
    emails(first: 5, isVerified: true) {
      edges {
        node {
          id
          value
        }
      }
    }
    name
  }
`)
