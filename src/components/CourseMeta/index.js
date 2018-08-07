import React, {Component} from 'react'
import {
  createFragmentContainer,
  graphql
} from 'react-relay'
import { get } from 'utils'
import CourseMetaDetails from './CourseMetaDetails'
import CourseMetaTopics from './CourseMetaTopics'

import './CourseMeta.css'

class CourseMeta extends Component {
  render() {
    const course = get(this.props, "course", {})
    return (
      <div className="CourseMeta">
        <CourseMetaDetails course={course} />
        <CourseMetaTopics course={course} />
      </div>
    )
  }
}

export default createFragmentContainer(CourseMeta, graphql`
  fragment CourseMeta_course on Course {
    ...CourseMetaDetails_course
    ...CourseMetaTopics_course
  }
`)
