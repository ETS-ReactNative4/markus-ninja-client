import React, { Component } from 'react'
import { get } from 'utils'
import LessonComment from './LessonComment'
import Event from './Event'

class LessonTimelineItemPreview extends Component {
  render() {
    const item = get(this.props, "item", {})
    switch(item.__typename) {
      case "LessonComment":
        return <LessonComment comment={item} />
      case "Event":
        return <Event event={item} />
      default:
        return null
    }
  }
}

export default LessonTimelineItemPreview
