import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import UserLink from 'components/UserLink'
import { get, timeDifferenceForDate } from 'utils'

class CommentedNotification extends Component {
  render() {
    const event = get(this.props, "event", {})
    return (
      <div className="CommentedNotification">
        <span onClick={this.props.onClick} className="CommentedNotification__text">
          {get(event, "comment.bodyText", "")}
        </span>
        <UserLink user={get(event, "user", null)} />
        {timeDifferenceForDate(event.createdAt)}
      </div>
    )
  }
}

export default createFragmentContainer(CommentedNotification, graphql`
  fragment CommentedNotification_event on CommentedEvent {
    createdAt
    comment {
      id
      ...on LessonComment {
        bodyText
      }
    }
    user {
      ...UserLink_user
    }
  }
`)
