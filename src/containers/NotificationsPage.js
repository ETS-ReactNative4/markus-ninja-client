import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import ViewerNotifications from 'components/ViewerNotifications'

import { NOTIFICATIONS_PER_PAGE } from 'consts'

const NotificationsPageQuery = graphql`
  query NotificationsPageQuery(
    $count: Int!,
    $after: String
  ) {
    viewer {
      id
      ...ViewerNotifications_viewer
    }
  }
`

class NotificationsPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("NotificationsPage mdc-layout-grid", className)
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={NotificationsPageQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
          count: NOTIFICATIONS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__inner">
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    <ViewerNotifications viewer={props.viewer} />
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

export default NotificationsPage
