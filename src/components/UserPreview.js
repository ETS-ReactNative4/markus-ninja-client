import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class UserPreview extends Component {
  render() {
    const user = get(this.props, "user", {})
    return (
      <div>
        <Link to={user.resourcePath}>
          <span>{user.login}</span>
          <span>{user.name}</span>
          <div>{user.bio}</div>
        </Link>
      </div>
    )
  }
}

export default createFragmentContainer(UserPreview, graphql`
  fragment UserPreview_user on User {
    bio
    login
    name
    resourcePath
  }
`)
