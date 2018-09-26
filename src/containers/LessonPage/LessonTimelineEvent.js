import * as React from 'react'
import { get } from 'utils'
import LessonComment from 'components/LessonComment'
import ReferencedEvent from 'components/ReferencedEvent'

class LessonTimelineEvent extends React.PureComponent {
  render() {
    const {className} = this.props
    const item = get(this.props, "item", null)

    switch(item.__typename) {
      case "LessonComment":
        return <LessonComment className={className} comment={item} />
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

export default LessonTimelineEvent
