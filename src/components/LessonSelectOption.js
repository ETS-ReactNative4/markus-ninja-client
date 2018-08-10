import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'

class LessonSelectOption extends React.Component {
  render() {
    const lesson = get(this.props, "lesson", {})
    return (
      <option value={lesson.id}>{lesson.number}: {lesson.title}</option>
    )
  }
}

export default createFragmentContainer(LessonSelectOption, graphql`
  fragment LessonSelectOption_lesson on Lesson {
    id
    number
    title
  }
`)
