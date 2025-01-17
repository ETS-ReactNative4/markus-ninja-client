import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import CoursePreview from 'components/CoursePreview'
import LessonPreview from 'components/LessonPreview'
import StudyTimeline from './StudyTimeline'
import StudyMeta from './StudyMeta'
import {get, isEmpty} from 'utils'
import {STUDY_EVENTS_PER_PAGE, TOPICS_PER_PAGE} from 'consts'


const StudyOverviewPageQuery = graphql`
  query StudyOverviewPageQuery(
    $owner: String!,
    $name: String!,
    $eventCount: Int!,
    $afterEvent: String,
    $topicCount: Int!,
    $afterTopic: String,
  ) {
    study(owner: $owner, name: $name) {
      ...CreateLessonLink_study
      ...StudyTimeline_study @arguments(
        after: $afterEvent,
        count: $eventCount,
      )
      ...StudyMeta_study @arguments(
        after: $afterTopic,
        count: $topicCount,
      )
      courses(first: 6, orderBy:{direction:DESC, field:APPLE_COUNT}) {
        edges {
          node {
            id
            ...on Course {
              ...CardCoursePreview_course
            }
          }
        }
      }
      lessons(first: 6, filterBy:{isPublished:true} orderBy:{direction:DESC, field:COMMENT_COUNT}) {
        edges {
          node {
            id
            ...on Lesson {
              ...CardLessonPreview_lesson
            }
          }
        }
        totalCount
      }
      viewerCanAdmin
    }
  }
`

class StudyOverviewPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudyOverviewPage mdc-layout-grid__inner", className)
  }

  render() {
    const { match } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={StudyOverviewPageQuery}
        variables={{
          owner: match.params.owner,
          name: match.params.name,
          eventCount: STUDY_EVENTS_PER_PAGE,
          topicCount: TOPICS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const courses = get(props, "study.courses.edges", [])
            const lessons = get(props, "study.lessons.edges", [])

            return (
              <div className={this.classes}>
                <StudyMeta study={props.study}  />
                {!isEmpty(lessons) &&
                <React.Fragment>
                  <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    Popular lessons
                  </h5>
                  {lessons.map(({node}) => (
                    node &&
                    <div key={node.id} className="mdc-layout-grid__cell">
                      <LessonPreview.Card className="h-100" lesson={node} />
                    </div>
                  ))}
                </React.Fragment>}
                {!isEmpty(courses) &&
                <React.Fragment>
                  <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    Popular courses
                  </h5>
                  {courses.map(({node}) => (
                    node &&
                    <div key={node.id} className="mdc-layout-grid__cell">
                      <CoursePreview.Card className="h-100" course={node} />
                    </div>
                  ))}
                </React.Fragment>}
                <StudyTimeline study={props.study} />
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default StudyOverviewPage
