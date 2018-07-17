import * as React from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import UserProfileForm from 'components/UserProfileForm'

const UserSettingsProfilePageQuery = graphql`
  query UserSettingsProfilePageQuery {
    viewer {
      ...UserProfileForm_user
    }
  }
`

class UserSettingsProfilePage extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={UserSettingsProfilePageQuery}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div>
                <h2>Public profile</h2>
                <UserProfileForm user={props.viewer} />
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default UserSettingsProfilePage
