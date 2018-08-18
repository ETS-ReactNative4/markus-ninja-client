import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class UserLink extends Component {
  render() {
    const { className } = this.props
    const user = get(this.props, "user", {})
    return (
      <Link className={className} to={user.resourcePath}>
        {user.login}
      </Link>
    )
  }
}

export default createFragmentContainer(UserLink, graphql`
  fragment UserLink_user on User {
    login
    resourcePath
  }
`)
