import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import { get } from 'utils'
import EnrollmentSelect from 'components/EnrollmentSelect'
import UserBio from 'components/UserBio'
import UserTabs from './UserTabs'

import './User.css'

class User extends Component {
  render() {
    const user = get(this.props, "user", {})
    const email = get(user, "email.value", null)
    return (
      <div className="User">
        <div className="User__name">{user.name}</div>
        <div className="User__username">{user.login}</div>
        <UserBio user={user} />
        {!user.isViewer &&
        <EnrollmentSelect enrollable={user} />}
        {email &&
        <div className="User__email">{email}</div>}
        <UserTabs user={user} />
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(User, graphql`
  fragment User_user on User {
    id
    bio
    bioHTML
    createdAt
    email {
      value
    }
    isViewer
    login
    name
    ...EnrollmentSelect_enrollable
    ...UserTabs_user
  }
`))
