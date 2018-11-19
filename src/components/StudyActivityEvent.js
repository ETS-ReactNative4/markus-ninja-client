import * as React from 'react'
import { get } from 'utils'
import CreatedEvent from 'components/CreatedEvent'
import PublishedEvent from 'components/PublishedEvent'

class StudyActivityEvent extends React.Component {
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
      case "CreatedEvent":
        return <CreatedEvent {...this.otherProps} className={className} withUser event={event} />
      case "PublishedEvent":
        return <PublishedEvent {...this.otherProps} className={className} twoLine event={event} />
      default:
        return null
    }
  }
}

export default StudyActivityEvent
