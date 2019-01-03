import * as React from 'react'
import {
  createPaginationContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import StudyPreview from 'components/StudyPreview'
import UserLink from 'components/UserLink'
import Notification from './Notification.js'
import MarkAllStudyNotificationsAsReadMutation from 'mutations/MarkAllStudyNotificationsAsReadMutation'
import {get, groupBy, isEmpty, isNil} from 'utils'

import { NOTIFICATIONS_PER_PAGE } from 'consts'

class ViewerNotifications extends React.Component {
  handleMarkAllAsRead = (studyId) => () => {
    MarkAllStudyNotificationsAsReadMutation(
      studyId,
      (response, error) => {
        if (!isNil(error)) {
          console.error(error)
        }
        window.location.reload()
      },
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

  render() {
    const notificationEdges = get(this.props, "viewer.notifications.edges", [])
    const notificationsByStudy = groupBy(notificationEdges, "node.study.id")
    if (isEmpty(notificationEdges)) {
      return (
        <div className="ViewerNotifications">
          <span>
            No new notifications
          </span>
        </div>
      )
    }
    return (
      <div className="ViewerNotifications">
        <div className="ViewerNotifications__notifications">
          {Object.keys(notificationsByStudy).map(key =>
            <div key={key} className="mdc-card mdc-card--outlined">
              <div className="flex flex-wrap items-center pa3">
                <h5 className="flex-auto">
                  <UserLink
                    className="rn-link"
                    user={get(this.props, "viewer", null)}
                  />
                  <span>/</span>
                  <StudyPreview.Link
                    className="rn-link"
                    study={get(notificationsByStudy[key][0], "node.study", null)}
                  />
                </h5>
                <button
                  className="mdc-button mdc-button--unelevated"
                  type="button"
                  onClick={this.handleMarkAllAsRead(key)}
                >
                  Mark all as read
                </button>
              </div>
              <div className="mdc-list mdc-list--two-line">
                <li role="separator" className="mdc-list-divider" />
                {notificationsByStudy[key].map(({node}) => (
                  <Notification key={node.id} notification={node} />
                ))}
              </div>
            </div>
          )}
          {this.props.relay.hasMore() &&
          <button
            className="ViewerNotifications__more"
            onClick={this._loadMore}
          >
            More
          </button>}
        </div>
      </div>
    )
  }
}

export default createPaginationContainer(ViewerNotifications,
  {
    viewer: graphql`
      fragment ViewerNotifications_viewer on User {
        ...UserLink_user
        notifications(
          first: $count,
          after: $after,
          orderBy:{direction: ASC field:CREATED_AT}
        ) @connection(key: "ViewerNotifications_notifications", filters: []) {
          edges {
            node {
              id
              study {
                ...LinkStudyPreview_study
                id
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
