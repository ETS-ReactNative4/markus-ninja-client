import * as React from 'react'
import { get } from 'utils'
import ReferencedEvent from 'components/ReferencedEvent'

class UserAssetTimelineEvent extends React.Component {
  render() {
    const {className} = this.props
    const item = get(this.props, "item", {})

    switch(item.__typename) {
      case "ReferencedEvent":
        return (
          <div className={className}>
            <ReferencedEvent className="ml3" event={item} />
          </div>
        )
      default:
        return null
    }
  }
}

export default UserAssetTimelineEvent
