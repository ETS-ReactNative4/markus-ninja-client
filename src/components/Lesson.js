import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'

class Lesson extends Component {
  render() {
    return (
      <div className="Lesson">
        <div className="Lesson__title">{this.props.lesson.title}</div>
        <div className="Lesson__body">{this.props.lesson.body}</div>
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
