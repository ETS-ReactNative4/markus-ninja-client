import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import UserLink from 'components/UserLink'
import CreateableLink from 'components/CreateableLink'
import CreateablePreview from 'components/CreateablePreview'
import { get, timeDifferenceForDate } from 'utils'

class CreatedNotification extends Component {
  render() {
    const event = get(this.props, "event", {})
    const createable = get(event, "createable", null)
    return (
      <div className="CreatedNotification">
        <div>
          <UserLink user={get(event, "user", null)} />
          <span>
            created
            <CreateableLink createable={createable} />
            {timeDifferenceForDate(event.createdAt)}
          </span>
        </div>
        <div>
          <CreateablePreview createable={createable} />
        </div>
      </div>
    )
  }
}

export default createFragmentContainer(CreatedNotification, graphql`
  fragment CreatedNotification_event on CreatedEvent {
    createable {
      ...CreateableLink_createable
      ...CreateablePreview_createable
    }
    createdAt
    id
    user {
      ...UserLink_user
    }
  }
`)
