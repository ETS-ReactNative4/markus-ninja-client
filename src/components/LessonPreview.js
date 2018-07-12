import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'

class LessonPreview extends Component {
  render() {
    return (
      <div>
        <a href={this.props.lesson.url}>
          {this.props.lesson.number}: {this.props.lesson.title}
        </a>
      </div>
    )
  }
}

export default createFragmentContainer(LessonPreview, graphql`
  fragment LessonPreview_lesson on Lesson {
    id
    number
    title
    url
  }
`)
