import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import UserLink from 'components/UserLink'
import CreateablePreview from 'components/CreateablePreview'
import { get, timeDifferenceForDate } from 'utils'

class CreatedNotification extends Component {
  render() {
    const event = get(this.props, "event", {})
    const createable = get(event, "createable", null)
    return (
      <div className="CreatedNotification">
        <CreateablePreview onClick={this.props.onClick} createable={createable} />
        <UserLink user={get(event, "user", null)} />
        {timeDifferenceForDate(event.createdAt)}
      </div>
    )
  }
}

export default createFragmentContainer(CreatedNotification, graphql`
  fragment CreatedNotification_event on CreatedEvent {
    createable {
      ...CreateablePreview_createable
    }
    createdAt
    id
    user {
      ...UserLink_user
    }
  }
`)
