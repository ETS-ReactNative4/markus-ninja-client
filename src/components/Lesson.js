import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'
import LessonBody from 'components/LessonBody'
import LessonHeader from 'components/LessonHeader'
import LessonTimeline from 'components/LessonTimeline'
import AddLessonCommentForm from 'components/AddLessonCommentForm'

class Lesson extends Component {
  render() {
    const lesson = get(this.props, "lesson", null)
    return (
      <div className="Lesson">
        <LessonHeader lesson={lesson}/>
        <LessonBody lesson={lesson}/>
        <LessonTimeline lesson={lesson} />
        <AddLessonCommentForm lesson={lesson} />
      </div>
    )
  }
}

export default createFragmentContainer(Lesson, graphql`
  fragment Lesson_lesson on Lesson {
    id
    ...LessonHeader_lesson
    ...LessonBody_lesson
    ...LessonTimeline_lesson
    ...AddLessonCommentForm_lesson
  }
`)
