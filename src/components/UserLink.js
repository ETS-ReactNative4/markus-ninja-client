import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'

class UserLink extends Component {
  render() {
    const user = get(this.props, "user", {})
    return (
      <a href={user.url}>
        {user.login}
      </a>
    )
  }
}

export default createFragmentContainer(UserLink, graphql`
  fragment UserLink_user on User {
    id
    login
    url
  }
`)
