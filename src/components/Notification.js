import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'
import CommentedEvent from './CommentedEvent'
import CreatedEvent from './CreatedEvent'

class Notification extends Component {
  render() {
    const event = get(this.props, "notification.event", null)
    switch(event.__typename) {
      case "CommentedEvent":
        return <CommentedEvent event={event} />
      case "CreatedEvent":
        return <CreatedEvent event={event} />
      default:
        return null
    }
  }
}

export default createFragmentContainer(Notification, graphql`
  fragment Notification_notification on Notification {
    id
    createdAt
    event {
      __typename
      ...CommentedEvent_event
      ...CreatedEvent_event
    }
    lastReadAt
    reason
    user {
      ...UserLink_user
    }
  }
`)
