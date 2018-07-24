import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import convert from 'htmr'
import { get, timeDifferenceForDate } from 'utils'

class Event extends Component {
  render() {
    const event = get(this.props, "event", {})
    return (
      <div className="Event">
        <Link to={get(event, "user.resourcePath", "")}>@{get(event, "user.login", "")}</Link>
        <span>{event.action} {timeDifferenceForDate(event.createdAt)}</span>
        <div>{convert(get(event, "source.bodyHTML"))}</div>
      </div>
    )
  }
}

export default createFragmentContainer(Event, graphql`
  fragment Event_event on Event {
    action
    createdAt
    id
    source {
      id
      ...on LessonComment {
        bodyHTML
      }
    }
    target {
      id
    }
    user {
      login
      resourcePath
    }
  }
`)
