import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import CoursePreview from 'components/CoursePreview'
import StudyPreview from 'components/StudyPreview'
import { get, timeDifferenceForDate } from 'utils'

class AppledEvent extends React.Component {
  render() {
    const event = get(this.props, "event", {})
    const appleable = get(event, "appleable", null)
    return (
      <div className="AppledEvent">
        <div>
          <span>
            Appled a {appleable.__typename.toLowerCase()}
            <span className="ml1">{timeDifferenceForDate(event.createdAt)}</span>
          </span>
        </div>
        <div>
          {(() => {
            switch(appleable.__typename) {
              case "Course":
                return <CoursePreview course={appleable} />
              case "Study":
                return <StudyPreview study={appleable} />
              default:
                return null
            }
          })()}
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
      }
      ...on Study {
        ...StudyPreview_study
      }
    }
    createdAt
    id
  }
`)
