import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import { get } from 'utils'
import CommentedNotification from './CommentedNotification'
import CreatedNotification from './CreatedNotification'
import MarkNotificationAsReadMutation from 'mutations/MarkNotificationAsReadMutation'
import { isNil } from 'utils'

class Notification extends Component {
  render() {
    const event = get(this.props, "notification.event", null)
    switch(event.__typename) {
      case "CommentedEvent":
        return (
          <CommentedNotification
            onClick={this.handleClick(get(this.props, "notification.id"))}
            event={event}
            value={get(this.props, "notification.id")}
          />
        )
      case "CreatedEvent":
        return <CreatedNotification onClick={this.handleClick} event={event} />
      default:
        return null
    }
  }

  handleClick = (notificationId) => (e) => {
    MarkNotificationAsReadMutation(
      notificationId,
      (response, error) => {
        if (!isNil(error)) {
          console.error(error)
        }
        this.props.history.push(get(this.props, "notification.event.resourcePath", "."))
      },
    )
  }
}

export default withRouter(createFragmentContainer(Notification, graphql`
  fragment Notification_notification on Notification {
    id
    createdAt
    event {
      __typename
      ...CommentedNotification_event
      ...CreatedNotification_event
      resourcePath
      url
    }
    lastReadAt
    reason
    user {
      ...UserLink_user
    }
  }
`))
