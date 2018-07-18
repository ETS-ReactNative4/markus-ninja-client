import * as React from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import ViewerEmailList from 'components/ViewerEmailList'
import ViewerPrimaryEmail from 'components/ViewerPrimaryEmail'
import ViewerBackupEmail from 'components/ViewerBackupEmail'

import { EMAILS_PER_PAGE } from 'consts'

const UserSettingsEmailsPageQuery = graphql`
  query UserSettingsEmailsPageQuery(
      $count: Int!
      $after: String
    ) {
    viewer {
      id
      ...ViewerEmailList_viewer
      ...ViewerPrimaryEmail_viewer
      ...ViewerBackupEmail_viewer
    }
  }
`

class UserSettingsEmailsPage extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={UserSettingsEmailsPageQuery}
        variables={{
          count: EMAILS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div>
                <h2>Emails</h2>
                <ViewerEmailList viewer={props.viewer} />
                <ViewerPrimaryEmail viewer={props.viewer} />
                <ViewerBackupEmail viewer={props.viewer} />
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default UserSettingsEmailsPage
