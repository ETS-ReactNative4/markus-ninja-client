import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import { get } from 'utils'
import EnrollmentSelect from 'components/EnrollmentSelect'
import UserBio from 'components/UserBio'

import './User.css'

class User extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("User", className)
  }

  render() {
    const user = get(this.props, "user", {})
    const userProp = get(this.props, "user", null)
    const email = get(user, "email.value", null)

    return (
      <div className={this.classes}>
        <h4>{user.name}</h4>
        <h5>{user.login}</h5>
        <UserBio className="mt2" user={userProp} />
        {!user.isViewer &&
        <EnrollmentSelect enrollable={userProp} />}
        {email &&
        <div className="User__email">email</div>}
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(User, graphql`
  fragment User_user on User {
    ...UserBio_user
    ...EnrollmentSelect_enrollable

    id
    createdAt
    email {
      value
    }
    isViewer
    login
    name
  }
`))
