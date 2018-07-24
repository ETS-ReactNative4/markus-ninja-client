import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { get, timeDifferenceForDate } from 'utils'
import LessonComment from 'components/LessonComment'

class CommentedEvent extends Component {
  render() {
    const event = get(this.props, "event", {})
    return (
      <div className="CommentedEvent">
        <Link to={get(event, "user.resourcePath", "")}>@{get(event, "user.login", "")}</Link>
        <span>commented {timeDifferenceForDate(event.createdAt)}</span>
        <LessonComment comment={event.comment} />
      </div>
    )
  }
}

export default createFragmentContainer(CommentedEvent, graphql`
  fragment CommentedEvent_event on CommentedEvent {
    createdAt
    comment {
      id
      ...on LessonComment {
        ...LessonComment_comment
      }
    }
    user {
      login
      resourcePath
    }
  }
`)
