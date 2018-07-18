import React, { Component } from 'react'
import { get } from 'utils'
import LessonPreview from './LessonPreview'
import StudyPreview from './StudyPreview'

class SearchResultItemPreview extends Component {
  render() {
    const item = get(this.props, "item", {})
    switch(item.__typename) {
      case "Lesson":
        return <LessonPreview lesson={item} />
      case "Study":
        return <StudyPreview study={item} />
      default:
        return null
    }
  }
}

export default SearchResultItemPreview
