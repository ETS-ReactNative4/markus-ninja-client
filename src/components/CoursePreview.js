import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get, timeDifferenceForDate } from 'utils'

class CoursePreview extends Component {
  render() {
    const course = get(this.props, "course", {})
    return (
      <div className="CoursePreview">
        <div className="CoursePreview__info">
          <a href={course.url}>
            {course.name}
          </a>
          <span>Advanced {timeDifferenceForDate(course.advancedAt)}</span>
        </div>
        <div className="CoursePreview__description">{course.description}</div>
      </div>
    )
  }
}

export default createFragmentContainer(CoursePreview, graphql`
  fragment CoursePreview_course on Course {
    advancedAt
    id
    description
    lessonCount
    name
    url
  }
`)
