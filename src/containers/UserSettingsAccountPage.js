import * as React from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import ChangePassword from 'components/ChangePassword'
import ChangeUsername from 'components/ChangeUsername'
import DeleteAccount from 'components/DeleteAccount'

const UserSettingsAccountPageQuery = graphql`
  query UserSettingsAccountPageQuery {
    viewer {
      id
      ...ChangeUsername_user
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
                <ChangePassword />
                <h2>Change username</h2>
                <ChangeUsername user={props.viewer} />
                <h2>Delete account</h2>
                <DeleteAccount />
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
