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
import LessonPreview from 'components/LessonPreview'
import StudyPreview from 'components/StudyPreview'
import {get} from 'utils'

class CreatedEvent extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CreatedEvent", className)
  }

  render() {
    const {withUser} = this.props
    const event = get(this.props, "event", {})
    const createable = get(event, "createable", null)

    return (
      <div className={this.classes}>
        <div>
          {withUser &&
          <UserLink className="rn-link fw5" user={get(event, "user", null)} />}
          <span className="ml1">
            {withUser ? 'c' : 'C'}reated a {createable.__typename.toLowerCase()}
          </span>
          {(() => {
            switch(createable.__typename) {
              case "Course":
                return (
                  <Link className="rn-link fw5 ml1" to={get(createable, "resourcePath")}>
                    {get(createable, "name")}
                  </Link>
                )
              case "Lesson":
                return (
                  <Link className="rn-link fw5 ml1" to={get(createable, "resourcePath")}>
                    {get(createable, "title")}
                  </Link>
                )
              case "Study":
                return (
                  <Link className="rn-link fw5 ml1" to={get(createable, "resourcePath")}>
                    {get(createable, "name")}
                  </Link>
                )
              default:
                return null
            }
          })()}
          <span className="ml1">
            on {moment(event.createdAt).format("MMM D")}
          </span>
        </div>
        <div className="pl2 pv2">
          <div className="mdc-card mdc-card--outlined pa3">
            {(() => {
              switch(createable.__typename) {
                case "Course":
                  return <CoursePreview course={createable} />
                case "Lesson":
                  return <LessonPreview lesson={createable} />
                case "Study":
                  return <StudyPreview.User study={createable} />
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

export default createFragmentContainer(CreatedEvent, graphql`
  fragment CreatedEvent_event on CreatedEvent {
    createable {
      __typename
      ...on Course {
        ...CoursePreview_course
        name
        resourcePath
      }
      ...on Lesson {
        ...LessonPreview_lesson
        resourcePath
        title
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
