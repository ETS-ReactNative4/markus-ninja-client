import * as React from 'react'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import ViewerEmailList from './ViewerEmailList'
import ViewerPrimaryEmail from './ViewerPrimaryEmail'
import ViewerBackupEmail from './ViewerBackupEmail'

import { EMAILS_PER_PAGE } from 'consts'

const EmailSettingsQuery = graphql`
  query EmailSettingsQuery(
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

class EmailSettings extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={EmailSettingsQuery}
        variables={{
          count: EMAILS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return (
              <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                {error.message}
              </div>
            )
          } else if (props) {
            return (
              <React.Fragment>
                <h4 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  Email
                </h4>
                <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <ViewerEmailList viewer={props.viewer} />
                </div>
                <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <ViewerPrimaryEmail viewer={props.viewer} />
                </div>
                <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <ViewerBackupEmail viewer={props.viewer} />
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

export default EmailSettings
