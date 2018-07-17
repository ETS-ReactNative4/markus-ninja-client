import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { get } from 'utils'
import Counter from 'components/Counter'
import UserBio from 'components/UserBio'

import './User.css'

class User extends Component {
  state = {
    edit: false,
  }

  render() {
    const user = get(this.props, "user", {})
    const email = get(user, "email.value", null)
    return (
      <div className="User">
        <div className="User__name">{user.name}</div>
        <div className="User__username">{user.login}</div>
        <UserBio user={user} />
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
            <Counter>{user.studies.totalCount}</Counter>
          </Link>
          <Link
            className="User__nav-item"
            to={user.resourcePath + "?tab=apples"}
          >
            Apples
            <Counter>{user.appled.studyCount}</Counter>
          </Link>
          <Link
            className="User__nav-item"
            to={user.resourcePath + "?tab=pupils"}
          >
            Pupils
            <Counter>{user.enrollees.totalCount}</Counter>
          </Link>
          <Link
            className="User__nav-item"
            to={user.resourcePath + "?tab=tutors"}
          >
            Tutors
            <Counter>{user.enrolled.userCount}</Counter>
          </Link>
        </nav>
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
  }
`))
