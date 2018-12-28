import * as React from 'react'
import { get } from 'utils'
import LabeledEvent from 'components/LabeledEvent'
import Comment from 'components/Comment'
import ReferencedEvent from 'components/ReferencedEvent'
import RenamedEvent from 'components/RenamedEvent'
import UnlabeledEvent from 'components/UnlabeledEvent'

class UserAssetTimelineEvent extends React.Component {
  render() {
    const {className} = this.props
    const item = get(this.props, "item", {})

    switch(item.__typename) {
      case "Comment":
        return <Comment className={className} comment={item} />
      case "LabeledEvent":
        return <LabeledEvent className={className} event={item} />
      case "ReferencedEvent":
        return <ReferencedEvent className={className} event={item} />
      case "RenamedEvent":
        return <RenamedEvent className={className} event={item} />
      case "UnlabeledEvent":
        return <UnlabeledEvent className={className} event={item} />
      default:
        return null
    }
  }
}

export default UserAssetTimelineEvent
