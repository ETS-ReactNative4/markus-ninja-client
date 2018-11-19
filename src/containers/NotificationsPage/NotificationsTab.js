import * as React from 'react'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import ViewerNotifications from './ViewerNotifications'

import { NOTIFICATIONS_PER_PAGE } from 'consts'

import "./styles.css"

const NotificationsTabQuery = graphql`
  query NotificationsTabQuery(
    $count: Int!,
    $after: String
  ) {
    viewer {
      id
      ...ViewerNotifications_viewer
    }
  }
`

class NotificationsTab extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={NotificationsTabQuery}
        variables={{
          count: NOTIFICATIONS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return <ViewerNotifications viewer={props.viewer} />
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default NotificationsTab
