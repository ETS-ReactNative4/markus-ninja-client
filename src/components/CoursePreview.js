import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import pluralize from 'pluralize'
import { get, isNil, timeDifferenceForDate } from 'utils'

class CoursePreview extends Component {
  render() {
    const course = get(this.props, "course", {})
    return (
      <div className="CoursePreview">
        <div className="CoursePreview__info">
          <Link to={course.resourcePath}>
            {course.name}
          </Link>
          <span>({course.lessonCount} {pluralize("lesson", course.lessonCount)})</span>
          {!isNil(course.advancedAt) &&
          <span>Advanced {timeDifferenceForDate(course.advancedAt)}</span>}
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
    resourcePath
  }
`)
