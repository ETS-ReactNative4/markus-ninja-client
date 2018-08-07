import React, { Component } from 'react'
import { get } from 'utils'
import CoursePreview from './CoursePreview'
import LessonPreview from './LessonPreview'
import StudyPreview from './StudyPreview'
import TopicPreview from './TopicPreview'
import UserPreview from './UserPreview'
import UserAssetPreview from './UserAssetPreview'

class SearchResultItemPreview extends Component {
  render() {
    const item = get(this.props, "item", {})
    switch(item.__typename) {
      case "Course":
        return <CoursePreview course={item} />
      case "Lesson":
        return <LessonPreview lesson={item} />
      case "Study":
        return <StudyPreview study={item} />
      case "Topic":
        return <TopicPreview topic={item} />
      case "User":
        return <UserPreview user={item} />
      case "UserAsset":
        return <UserAssetPreview asset={item} />
      default:
        return null
    }
  }
}

export default SearchResultItemPreview
