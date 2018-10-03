import * as React from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import ChangePassword from './ChangePassword'
import ChangeUsername from './ChangeUsername'
import DeleteAccount from './DeleteAccount'

const AccountSettingsQuery = graphql`
  query AccountSettingsQuery {
    viewer {
      id
      ...ChangeUsername_user
    }
  }
`

class AccountSettings extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={AccountSettingsQuery}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <React.Fragment>
                <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  Change password
                </h5>
                <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <ChangePassword />
                </div>
                <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  Change username
                </h5>
                <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <ChangeUsername user={props.viewer} />
                </div>
                <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  Delete account
                </h5>
                <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <DeleteAccount />
                </div>
              </React.Fragment>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default AccountSettings
