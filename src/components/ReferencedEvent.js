import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import moment from 'moment'
import UserLink from 'components/UserLink'
import LessonPreview from 'components/LessonPreview'
import {get} from 'utils'

class ReferencedEvent extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("ReferencedEvent", className)
  }

  render() {
    const event = get(this.props, "event", {})
    return (
      <div className={this.classes}>
        <div>
          <UserLink className="rn-link fw5" user={get(event, "user", null)} />
          <span className="ml1">
            {event.isCrossStudy && "cross-"}referenced this on {moment(event.createdAt).format("MMM D")}
          </span>
        </div>
        <div className="pl2 pv2">
          <LessonPreview lesson={event.source} />
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
      ...LessonPreview_lesson
    }
    user {
      ...UserLink_user
    }
  }
`)
