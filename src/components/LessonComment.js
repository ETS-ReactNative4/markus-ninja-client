import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import convert from 'htmr'
import { get } from 'utils'

class LessonComment extends Component {
  render() {
    const lessonComment = get(this.props, "lessonComment", {})
    return (
      <div className="LessonComment">
        <div className="LessonComment__body">{convert(lessonComment.bodyHTML)}</div>
      </div>
    )
  }
}

export default createFragmentContainer(LessonComment, graphql`
  fragment LessonComment_lessonComment on LessonComment {
    id
    createdAt
    body
    bodyHTML
    publishedAt
    updatedAt
    viewerCanDelete
    viewerCanUpdate
    viewerDidAuthor
  }
`)
