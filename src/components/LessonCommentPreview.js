import React, { Component } from 'react'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { Link } from 'react-router-dom'
import HTML from 'components/HTML'
import { get } from 'utils'

class LessonCommentPreview extends Component {
  render() {
    const comment = get(this.props, "comment", {})
    return (
      <Link
        className="LessonCommentPreview"
        to={comment.resourcePath}
      >
        <HTML className="LessonCommentPreview__bodyHTML" html={comment.bodyHTML} />
      </Link>
    )
  }
}

export default createFragmentContainer(LessonCommentPreview, graphql`
  fragment LessonCommentPreview_comment on LessonComment {
    id
    bodyHTML
    resourcePath
  }
`)
