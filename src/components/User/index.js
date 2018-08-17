import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import { withRouter } from 'react-router'
import { get } from 'utils'
import EnrollmentSelect from 'components/EnrollmentSelect'
import UserBio from 'components/UserBio'

import './User.css'

class User extends Component {
  render() {
    const { className } = this.props
    const user = get(this.props, "user", {})
    const email = get(user, "email.value", null)
    return (
      <div className={cls("User", className)}>
        <div className="mdc-typography--headline3">{user.name}</div>
        <div className="mdc-typography--subtitle1">{user.login}</div>
        <UserBio user={user} />
        {!user.isViewer &&
        <EnrollmentSelect enrollable={user} />}
        {email &&
        <div className="User__email">{email}</div>}
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
  }
`))
