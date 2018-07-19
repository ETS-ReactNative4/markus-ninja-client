import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'

class UserPreview extends Component {
  render() {
    const user = get(this.props, "user", {})
    return (
      <div>
        <a href={user.url}>
          <span>{user.login}</span>
          <span>{user.name}</span>
          <div>{user.bio}</div>
        </a>
      </div>
    )
  }
}

export default createFragmentContainer(UserPreview, graphql`
  fragment UserPreview_user on User {
    bio
    login
    name
    url
  }
`)
