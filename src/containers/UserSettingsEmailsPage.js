import * as React from 'react'
import cls from 'classnames'
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
  get classes() {
    const {className} = this.props
    return cls("UserSettingsEmailsPage mdc-layout-grid", className)
  }

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
              <div className={this.classes}>
                <div className="mdc-layout-grid__inner">
                  <h4 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    Emails
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
                </div>
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
