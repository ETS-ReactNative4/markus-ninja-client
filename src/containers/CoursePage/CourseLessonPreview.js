import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import RemoveCourseLessonMutation from 'mutations/RemoveCourseLessonMutation'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class CourseLessonPreview extends Component {
  render() {
    const lesson = get(this.props, "lesson", {})
    return (
      <div>
        <Link to={lesson.resourcePath}>
          {lesson.courseNumber}: {lesson.title}
        </Link>
        <button className="btn" type="button" onClick={this.handleRemove}>
          Remove
        </button>
      </div>
    )
  }

  handleRemove = () => {
    RemoveCourseLessonMutation(
      this.props.lesson.id,
    )
  }
}

export default createFragmentContainer(CourseLessonPreview, graphql`
  fragment CourseLessonPreview_lesson on Lesson {
    id
    courseNumber
    resourcePath
    title
  }
`)
