import React, { Component } from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import Notification from './Notification.js'
import { get, groupBy } from 'utils'

import { NOTIFICATIONS_PER_PAGE } from 'consts'

class ViewerNotifications extends Component {
  render() {
    const notificationEdges = get(this.props, "viewer.notifications.edges", [])
    const notificationsByStudy = groupBy(notificationEdges, "node.study.id")
    return (
      <div>
        <div className="ViewerNotifications__notifications">
          {Object.keys(notificationsByStudy).map(key =>
            <div key={key}>
              {get(notificationsByStudy[key][0], "node.study.nameWithOwner", "")}
              {notificationsByStudy[key].map(({node}) => (
                <Notification key={node.id} notification={node} />
              ))}
            </div>
          )}
          <button
            className="ViewerNotifications__more"
            onClick={this._loadMore}
          >
            More
          </button>
        </div>
      </div>
    )
  }

  _loadMore = () => {
    const relay = get(this.props, "relay")
    if (!relay.hasMore()) {
      console.log("Nothing more to load")
      return
    } else if (relay.isLoading()){
      console.log("Request is already pending")
      return
    }

    relay.loadMore(NOTIFICATIONS_PER_PAGE)
  }
}

export default createPaginationContainer(ViewerNotifications,
  {
    viewer: graphql`
      fragment ViewerNotifications_viewer on User {
        notifications(
          first: $count,
          after: $after,
          orderBy:{direction: ASC field:CREATED_AT}
        ) @connection(key: "ViewerNotifications_notifications") {
          edges {
            node {
              id
              study {
                id
                nameWithOwner
              }
              ...Notification_notification
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    query: graphql`
      query ViewerNotificationsForwardQuery(
        $count: Int!,
        $after: String
      ) {
        viewer {
          ...ViewerNotifications_viewer
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "viewer.notifications")
    },
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables,
        count: totalCount,
      }
    },
    getVariables(props, paginationInfo, getFragmentVariables) {
      return {
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    },
  },
)
