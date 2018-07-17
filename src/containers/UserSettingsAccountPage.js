import * as React from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import UserAccountChangePasswordForm from 'components/UserAccountChangePasswordForm'
import UserAccountChangeUsernameForm from 'components/UserAccountChangeUsernameForm'

const UserSettingsAccountPageQuery = graphql`
  query UserSettingsAccountPageQuery {
    viewer {
      id
      ...UserAccountChangeUsernameForm_user
    }
  }
`

class UserSettingsAccountPage extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={UserSettingsAccountPageQuery}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div>
                <h2>Change password</h2>
                <UserAccountChangePasswordForm />
                <h2>Change username</h2>
                <UserAccountChangeUsernameForm user={props.viewer} />
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default UserSettingsAccountPage
