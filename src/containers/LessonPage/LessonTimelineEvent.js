import * as React from 'react'
import { get } from 'utils'
import AddedToCourseEvent from 'components/AddedToCourseEvent'
import LabeledEvent from 'components/LabeledEvent'
import LessonComment from 'components/LessonComment'
import ReferencedEvent from 'components/ReferencedEvent'
import RemovedFromCourseEvent from 'components/RemovedFromCourseEvent'
import RenamedEvent from 'components/RenamedEvent'
import UnlabeledEvent from 'components/UnlabeledEvent'

class LessonTimelineEvent extends React.PureComponent {
  render() {
    const {className} = this.props
    const item = get(this.props, "item", null)

    switch(item.__typename) {
      case "AddedToCourseEvent":
        return <AddedToCourseEvent className={className} event={item} />
      case "LabeledEvent":
        return <LabeledEvent className={className} event={item} />
      case "LessonComment":
        return <LessonComment className={className} comment={item} />
      case "ReferencedEvent":
        return <ReferencedEvent className={className} event={item} />
      case "RemovedFromCourseEvent":
        return <RemovedFromCourseEvent className={className} event={item} />
      case "RenamedEvent":
        return <RenamedEvent className={className} event={item} />
      case "UnlabeledEvent":
        return <UnlabeledEvent className={className} event={item} />
      default:
        return null
    }
  }
}

export default LessonTimelineEvent
