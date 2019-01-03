import * as React from 'react'
import { get } from 'utils'
import AppledEvent from 'components/AppledEvent'
import CreatedEvent from 'components/CreatedEvent'
import PublishedEvent from 'components/PublishedEvent'

class UserTimelineEvent extends React.Component {
  get otherProps() {
    const {
      className,
      event,
      ...otherProps
    } = this.props
    return otherProps
  }

  render() {
    const {className} = this.props
    const event = get(this.props, "event", {})

    switch(event.__typename) {
      case "AppledEvent":
        return <AppledEvent {...this.otherProps} className={className} event={event} />
      case "CreatedEvent":
        return <CreatedEvent {...this.otherProps} className={className} event={event} />
      case "PublishedEvent":
        return <PublishedEvent {...this.otherProps} className={className} twoLine event={event} />
      default:
        return null
    }
  }
}

export default UserTimelineEvent
