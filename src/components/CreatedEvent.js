import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import CoursePreview from 'components/CoursePreview'
import LessonPreview from 'components/LessonPreview'
import StudyPreview from 'components/StudyPreview'
import { get, timeDifferenceForDate } from 'utils'

class CreatedEvent extends Component {
  render() {
    const event = get(this.props, "event", {})
    const createable = get(event, "createable", null)
    return (
      <div className="CreatedEvent">
        <div>
          <span className="inline-flex">
            Created a {createable.__typename.toLowerCase()}
            <span className="ml1">{timeDifferenceForDate(event.createdAt)}</span>
          </span>
        </div>
        <div>
          {(() => {
            switch(createable.__typename) {
              case "Course":
                return <CoursePreview course={createable} />
              case "Lesson":
                return <LessonPreview lesson={createable} />
              case "Study":
                return <StudyPreview study={createable} />
              default:
                return null
            }
          })()}
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
      }
      ...on Lesson {
        ...LessonPreview_lesson
      }
      ...on Study {
        ...StudyPreview_study
      }
    }
    createdAt
    id
  }
`)
