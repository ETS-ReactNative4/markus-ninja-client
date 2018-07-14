import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'

class LessonPreview extends Component {
  render() {
    const lesson = get(this.props, "lesson", {})
    return (
      <div>
        <a href={lesson.url}>
          {lesson.number}: {lesson.title}
        </a>
      </div>
    )
  }
}

export default createFragmentContainer(LessonPreview, graphql`
  fragment LessonPreview_lesson on Lesson {
    id
    number
    title
    url
  }
`)
