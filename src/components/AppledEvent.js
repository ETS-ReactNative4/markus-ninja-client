import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import UserLink from 'components/UserLink'
import AppleableLink from 'components/AppleableLink'
import AppleablePreview from 'components/AppleablePreview'
import { get, timeDifferenceForDate } from 'utils'

class AppledEvent extends Component {
  render() {
    const event = get(this.props, "event", {})
    const appleable = get(event, "appleable", null)
    return (
      <div className="AppledEvent">
        <div>
          <UserLink user={get(event, "user", null)} />
          <span>
            appled
            <AppleableLink appleable={appleable} />
            {timeDifferenceForDate(event.createdAt)}
          </span>
        </div>
        <div>
          <AppleablePreview appleable={appleable} />
        </div>
      </div>
    )
  }
}

export default createFragmentContainer(AppledEvent, graphql`
  fragment AppledEvent_event on AppledEvent {
    appleable {
      ...AppleableLink_appleable
      ...AppleablePreview_appleable
    }
    createdAt
    id
    user {
      ...UserLink_user
    }
  }
`)
