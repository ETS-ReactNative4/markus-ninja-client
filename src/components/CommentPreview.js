import React, { Component } from 'react'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { Link } from 'react-router-dom'
import HTML from 'components/HTML'
import { get } from 'utils'

class CommentPreview extends Component {
  render() {
    const comment = get(this.props, "comment", {})
    return (
      <Link
        className="CommentPreview"
        to={comment.resourcePath}
      >
        <HTML className="CommentPreview__bodyHTML" html={comment.bodyHTML} />
      </Link>
    )
  }
}

export default createFragmentContainer(CommentPreview, graphql`
  fragment CommentPreview_comment on Comment {
    id
    bodyHTML
    resourcePath
  }
`)
