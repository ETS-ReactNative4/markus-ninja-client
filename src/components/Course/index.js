import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import { get } from 'utils'
import AppleButton from 'components/AppleButton'
import EnrollmentSelect from 'components/EnrollmentSelect'
import Counter from 'components/Counter'
import CourseLessons from 'components/CourseLessons'
import { isNil, timeDifferenceForDate } from 'utils'

import './Course.css'

class Course extends Component {
  state = {
    edit: false,
  }

  render() {
    const course = get(this.props, "course", null)
    if (isNil(course)) {
      return null
    }
    return (
      <div className="Course">
        <div className="Course__name">
          <h3>{course.name}</h3>
          <span>Advanced {timeDifferenceForDate(course.advancedAt)}</span>
        </div>
        <ul className="Course__actions">
          <li>
            <EnrollmentSelect enrollable={course} />
          </li>
          <li>
            <AppleButton appleable={course} />
          </li>
        </ul>
        <div className="Course_lessons">
          <h3>
            <Counter>{course.lessonCount}</Counter>
            Lessons
          </h3>
          <CourseLessons course={course} />
        </div>
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(Course, graphql`
  fragment Course_course on Course {
    id
    advancedAt
    createdAt
    lessonCount
    name
    resourcePath
    updatedAt
    url
    viewerCanAdmin
    ...CourseLessons_course
    ...AppleButton_appleable
    ...EnrollmentSelect_enrollable
  }
`))
