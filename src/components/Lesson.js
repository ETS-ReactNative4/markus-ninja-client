import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import convert from 'htmr'
import { get } from 'utils'

class Lesson extends Component {
  render() {
    const lesson = get(this.props, "lesson", {})
    return (
      <div className="Lesson">
        <div className="Lesson__title">{lesson.title}</div>
        <div className="Lesson__body">{convert(lesson.bodyHTML)}</div>
      </div>
    )
  }
}

export default createFragmentContainer(Lesson, graphql`
  fragment Lesson_lesson on Lesson {
    id
    createdAt
    body
    bodyHTML
    number
    title
    publishedAt
    updatedAt
    viewerCanUpdate
    viewerDidAuthor
    viewerHasEnrolled
  }
`)
