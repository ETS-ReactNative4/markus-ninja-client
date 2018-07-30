import React, {Component} from 'react'
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

class NotificationsPage extends Component {
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
              <div>
                <ViewerNotifications viewer={props.viewer} />
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
