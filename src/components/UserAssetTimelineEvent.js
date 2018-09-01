import * as React from 'react'
import { get } from 'utils'
import ReferencedEvent from 'components/ReferencedEvent'

class UserAssetTimelineEvent extends React.Component {
  render() {
    const item = get(this.props, "item", {})
    switch(item.__typename) {
      case "ReferencedEvent":
        return <ReferencedEvent event={item} />
      default:
        return null
    }
  }
}

export default UserAssetTimelineEvent
