import React, { Component } from 'react'
import { get } from 'utils'
import CommentedEvent from './CommentedEvent'
import ReferencedEvent from './ReferencedEvent'

class UserAssetTimelineEvent extends Component {
  render() {
    const item = get(this.props, "item", {})
    switch(item.__typename) {
      case "CommentedEvent":
        return <CommentedEvent event={item} />
      case "ReferencedEvent":
        return <ReferencedEvent event={item} />
      default:
        return null
    }
  }
}

export default UserAssetTimelineEvent
