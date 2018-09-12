import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import moment from 'moment'
import { Link } from 'react-router-dom'
import UserLink from 'components/UserLink'
import CoursePreview from 'components/CoursePreview'
import StudyPreview from 'components/StudyPreview'
import {get} from 'utils'

class AppledEvent extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("AppledEvent", className)
  }

  render() {
    const {withUser} = this.props
    const event = get(this.props, "event", {})
    const appleable = get(event, "appleable", null)
    return (
      <div className={this.classes}>
        <div>
          {withUser &&
          <UserLink className="rn-link fw5" user={get(event, "user", null)} />}
          <span className="ml1">
            {withUser ? 'a' : 'A'}ppled a {appleable.__typename.toLowerCase()}
          </span>
          <Link className="rn-link fw5 ml1" to={get(appleable, "resourcePath")}>
            {get(appleable, "name")}
          </Link>
          <span
            className="mdc-typography--text-secondary-on-light ml1"
          >
            on {moment(event.createdAt).format("MMM D")}
          </span>
        </div>
        <div className="pl2 pv2">
          <div className="mdc-card mdc-card--outlined pa3">
            {(() => {
              switch(appleable.__typename) {
                case "Course":
                  return <CoursePreview course={appleable} />
                case "Study":
                  return <StudyPreview.User study={appleable} />
                default:
                  return null
              }
            })()}
          </div>
        </div>
      </div>
    )
  }
}

export default createFragmentContainer(AppledEvent, graphql`
  fragment AppledEvent_event on AppledEvent {
    appleable {
      __typename
      ...on Course {
        ...CoursePreview_course
        name
        resourcePath
      }
      ...on Study {
        ...StudyPreview_study
        name
        resourcePath
      }
    }
    createdAt
    id
    user {
      ...UserLink_user
    }
  }
`)
