import React, { Component } from 'react'
import { get } from 'utils'
import AppledEvent from './AppledEvent'
import CreatedEvent from './CreatedEvent'

class UserActivityEvent extends Component {
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
