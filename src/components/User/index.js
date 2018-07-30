import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { get } from 'utils'
import Counter from 'components/Counter'
import EnrollmentSelect from 'components/EnrollmentSelect'
import UserBio from 'components/UserBio'
import UserActivity from 'components/UserActivity'

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
        <EnrollmentSelect enrollable={user} />
        {email &&
        <div className="User__email">{email}</div>}
        <nav className="User__nav">
          <Link
            className="User__nav-item"
            to={user.resourcePath}
          >
            Overview
          </Link>
          <Link
            className="User__nav-item"
            to={user.resourcePath + "?tab=studies"}
          >
            Studies
            <Counter>{get(user, "studies.totalCount", 0)}</Counter>
          </Link>
          <Link
            className="User__nav-item"
            to={user.resourcePath + "?tab=apples"}
          >
            Apples
            <Counter>{get(user, "appled.studyCount", 0)}</Counter>
          </Link>
          <Link
            className="User__nav-item"
            to={user.resourcePath + "?tab=pupils"}
          >
            Pupils
            <Counter>{get(user, "enrollees.totalCount", 0)}</Counter>
          </Link>
          <Link
            className="User__nav-item"
            to={user.resourcePath + "?tab=tutors"}
          >
            Tutors
            <Counter>{get(user, "enrolled.userCount", 0)}</Counter>
          </Link>
        </nav>
        <UserActivity user={user} />
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(User, graphql`
  fragment User_user on User {
    id
    appled(first: 0 type: STUDY) {
      studyCount
    }
    bio
    bioHTML
    createdAt
    email {
      value
    }
    enrollees(first: 0) {
      totalCount
    }
    enrolled(first: 0 type: USER) {
      userCount
    }
    login
    name
    resourcePath
    studies(first: 0) {
      totalCount
    }
    ...EnrollmentSelect_enrollable
    ...UserActivity_user
  }
`))
