import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { get, nullOr } from 'utils'
import LessonBody from 'components/LessonBody'
import LessonHeader from 'components/LessonHeader'
import LessonTimeline from 'components/LessonTimeline'
import AddLessonCommentForm from 'components/AddLessonCommentForm'

class Lesson extends Component {
  render() {
    const lesson = get(this.props, "lesson", {})
    return (
      <div className="Lesson">
        <LessonHeader lesson={nullOr(lesson)}/>
        <LessonBody lesson={nullOr(lesson)}/>
        {lesson.hasPrevLesson &&
        <Link to={`./${lesson.number-1}`}>Previous</Link>}
        {lesson.hasNextLesson &&
        <Link to={`./${lesson.number+1}`}>Next</Link>}
        <LessonTimeline lesson={lesson} />
        <AddLessonCommentForm lesson={lesson} />
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
    hasNextLesson
    hasPrevLesson
    number
    title
    publishedAt
    updatedAt
    viewerCanUpdate
    viewerDidAuthor
    ...LessonTimeline_lesson
    ...AddLessonCommentForm_lesson
  }
`)
