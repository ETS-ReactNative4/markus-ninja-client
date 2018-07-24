import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import convert from 'htmr'
import { get } from 'utils'

class LessonComment extends Component {
  render() {
    const comment = get(this.props, "comment", {})
    return (
      <div className="LessonComment">
        <div className="LessonComment__body">{convert(comment.bodyHTML)}</div>
      </div>
    )
  }
}

export default createFragmentContainer(LessonComment, graphql`
  fragment LessonComment_comment on LessonComment {
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
