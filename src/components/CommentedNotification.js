import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import LessonLink from 'components/LessonLink'
import StudyLink from 'components/StudyLink'
import UserLink from 'components/UserLink'
import HTML from 'components/HTML'
import { get, timeDifferenceForDate } from 'utils'

class CommentedNotification extends Component {
  render() {
    const event = get(this.props, "event", {})
    return (
      <div onClick={this.props.onClick} className="CommentedNotification">
        <UserLink user={get(event, "user", null)} />
        <span>
          commented on lesson
          <LessonLink lesson={get(event, "commentable", null)} />
        </span>
        <span>
          from
          <StudyLink study={get(event, "commentable.study", null)} />
          {timeDifferenceForDate(event.createdAt)}
        </span>
        <HTML
          className="LessonCommentPreview__bodyHTML"
          html={get(event, "comment.bodyHTML", "")}
        />
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
        bodyHTML
        resourcePath
      }
    }
    commentable {
      id
      ... on Lesson {
        ...LessonLink_lesson
        study {
          ...StudyLink_study
        }
      }
    }
    user {
      ...UserLink_user
    }
  }
`)
