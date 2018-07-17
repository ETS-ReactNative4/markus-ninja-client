import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'
import UpdateUserProfileForm from 'components/UpdateUserProfileForm'
import UserDangerZone from 'components/UserDangerZone'

class UserSettings extends Component {
  render() {
    const user = get(this.props, "user", {})
    return (
      <div className="UserSettings">
        <UpdateUserProfileForm user={user} />
        <UserDangerZone user={user} />
      </div>
    )
  }
}

export default createFragmentContainer(UserSettings, graphql`
  fragment UserSettings_user on User {
    id
    name
  }
`)
