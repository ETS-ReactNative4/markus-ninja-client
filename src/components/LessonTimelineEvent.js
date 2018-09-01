import React, { Component } from 'react'
import { get } from 'utils'
import LessonComment from 'components/LessonComment'
import ReferencedEvent from 'components/ReferencedEvent'

class LessonTimelineEvent extends Component {
  render() {
    const item = get(this.props, "item", {})
    switch(item.__typename) {
      case "LessonComment":
        return <LessonComment comment={item} />
      case "ReferencedEvent":
        return <ReferencedEvent event={item} />
      default:
        return null
    }
  }
}

export default LessonTimelineEvent
