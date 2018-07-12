import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'

class UserLink extends Component {
  render() {
    return (
      <a href={this.props.user.url}>
        {this.props.user.login}
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
