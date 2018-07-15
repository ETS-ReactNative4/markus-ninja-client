import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get, nullOr } from 'utils'
import UpdateLessonBodyForm from 'components/UpdateLessonBodyForm'
import LessonHeader from 'components/LessonHeader'

class Lesson extends Component {
  render() {
    const lesson = get(this.props, "lesson", {})
    return (
      <div className="Lesson">
        <LessonHeader lesson={nullOr(lesson)}/>
        <UpdateLessonBodyForm lesson={nullOr(lesson)}/>
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
