import * as React from 'react'
import { get } from 'utils'
import AppledEvent from 'components/AppledEvent'
import CreatedEvent from 'components/CreatedEvent'

class UserActivityEvent extends React.Component {
  render() {
    const event = get(this.props, "event", {})
    switch(event.__typename) {
      case "AppledEvent":
        return <AppledEvent event={event} />
      case "CreatedEvent":
        return <CreatedEvent event={event} />
      default:
        return null
    }
  }
}

export default UserActivityEvent
