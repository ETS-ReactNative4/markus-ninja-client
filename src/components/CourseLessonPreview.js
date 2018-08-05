import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'

class CourseLessonPreview extends Component {
  render() {
    const lesson = get(this.props, "lesson", {})
    return (
      <div>
        <a href={lesson.url}>
          {lesson.courseNumber}: {lesson.title}
        </a>
      </div>
    )
  }
}

export default createFragmentContainer(CourseLessonPreview, graphql`
  fragment CourseLessonPreview_lesson on Lesson {
    id
    courseNumber
    title
    url
  }
`)
