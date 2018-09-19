import * as React from 'react'
import { get } from 'utils'
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
      case "Course":
        return <CoursePreview className={className} course={item} />
      case "Lesson":
        return <LessonPreview className={className} lesson={item} />
      case "Study":
        return <StudyPreview className={className} study={item} />
      case "Topic":
        return <TopicPreview className={className} topic={item} />
      case "User":
        return <UserPreview className={className} user={item} />
      case "UserAsset":
        return <UserAssetPreview className={className} asset={item} />
      default:
        return null
    }
  }
}

export default SearchResultItemPreview
