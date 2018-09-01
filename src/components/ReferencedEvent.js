import React, { Component } from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import UserLink from 'components/UserLink'
import { get, timeDifferenceForDate } from 'utils'

class ReferencedEvent extends Component {
  get classes() {
    const {className} = this.props
    return cls("ReferencedEvent mdc-card", className)
  }

  render() {
    const event = get(this.props, "event", {})
    return (
      <div className={this.classes}>
        <UserLink user={get(event, "user", null)} />
        <span>{event.isCrossStudy && "cross-"}referenced this {timeDifferenceForDate(event.createdAt)}</span>
        <div>
          from
          <Link to={get(event, "source.resourcePath", "")}>here</Link>
        </div>
      </div>
    )
  }
}

export default createFragmentContainer(ReferencedEvent, graphql`
  fragment ReferencedEvent_event on ReferencedEvent {
    createdAt
    id
    isCrossStudy
    source {
      resourcePath
    }
    user {
      ...UserLink_user
    }
  }
`)
