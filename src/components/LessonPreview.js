import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class LessonPreview extends Component {
  render() {
    const lesson = get(this.props, "lesson", {})
    return (
      <div>
        <Link className="link" to={lesson.resourcePath}>
          {lesson.number}: {lesson.title}
        </Link>
      </div>
    )
  }
}

export default createFragmentContainer(LessonPreview, graphql`
  fragment LessonPreview_lesson on Lesson {
    id
    number
    title
    resourcePath
  }
`)
