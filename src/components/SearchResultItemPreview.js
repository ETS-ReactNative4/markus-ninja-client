import * as React from 'react'
import { get } from 'utils'
import ActivityPreview from './ActivityPreview'
import CoursePreview from './CoursePreview'
import LessonPreview from './LessonPreview'
import StudyPreview from './StudyPreview'
import TopicPreview from './TopicPreview'
import UserPreview from './UserPreview'
import UserAssetPreview from './UserAssetPreview'

class SearchResultItemPreview extends React.Component {
  render() {
    const {className} = this.props
    const item = get(this.props, "item", {})

    switch(item.__typename) {
      case "Activity":
        return <ActivityPreview.List className={className} activity={item} />
      case "Course":
        return <CoursePreview.List className={className} course={item} />
      case "Lesson":
        return <LessonPreview.List className={className} lesson={item} />
      case "Study":
        return <StudyPreview.List className={className} study={item} />
      case "Topic":
        return <TopicPreview.List className={className} topic={item} />
      case "User":
        return <UserPreview.List className={className} user={item} />
      case "UserAsset":
        return <UserAssetPreview.List className={className} asset={item} />
      default:
        return null
    }
  }
}

export default SearchResultItemPreview
