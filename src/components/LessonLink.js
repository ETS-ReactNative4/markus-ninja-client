import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class LessonLink extends Component {
  render() {
    const lesson = get(this.props, "lesson", {})
    return (
      <Link to={lesson.resourcePath}>
        #{lesson.number}
      </Link>
    )
  }
}

export default createFragmentContainer(LessonLink, graphql`
  fragment LessonLink_lesson on Lesson {
    id
    number
    resourcePath
  }
`)
