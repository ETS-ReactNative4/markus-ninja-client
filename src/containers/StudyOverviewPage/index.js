import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import CreateLessonLink from 'components/CreateLessonLink'
import CoursePreview from 'components/CoursePreview'
import LessonPreview from 'components/LessonPreview'
import StudyMeta from './StudyMeta'
import {get, isEmpty} from 'utils'
import { TOPICS_PER_PAGE } from 'consts'

const StudyOverviewPageQuery = graphql`
  query StudyOverviewPageQuery($owner: String!, $name: String!, $count: Int!, $after: String) {
    study(owner: $owner, name: $name) {
      ...CreateLessonLink_study
      ...StudyMeta_study
      courses(first: 6, orderBy:{direction:DESC, field:APPLE_COUNT}) {
        edges {
          node {
            id
            ...on Course {
              ...CoursePreview_course
            }
          }
        }
      }
      lessons(first: 6, orderBy:{direction:DESC, field:COMMENT_COUNT}) {
        edges {
          node {
            id
            ...on Lesson {
              ...LessonPreview_lesson
            }
          }
        }
      }
      lessonCount
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
          count: TOPICS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const courses = get(props, "study.courses.edges", [])
            const lessons = get(props, "study.lessons.edges", [])

            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <StudyMeta study={props.study}  />
                </div>
                {!isEmpty(lessons) &&
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <div className="mdc-layout-grid__inner">
                    <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                      Popular lessons
                    </h5>
                    {lessons.map(({node}) => (
                      node &&
                      <div key={node.id} className="mdc-layout-grid__cell">
                        <LessonPreview.Study className="mdc-card mdc-card--outlined pa3 h-100" lesson={node} />
                      </div>
                    ))}
                  </div>
                </div>}
                {!isEmpty(courses) &&
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <div className="mdc-layout-grid__inner">
                    <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                      Popular courses
                    </h5>
                    {courses.map(({node}) => (
                      node &&
                      <div key={node.id} className="mdc-layout-grid__cell">
                        <CoursePreview.Study
                          className="mdc-card mdc-card--outlined pa3 h-100"
                          course={node}
                        />
                      </div>
                    ))}
                  </div>
                </div>}
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  {props.study.lessonCount < 1 &&
                  <CreateLessonLink className="rn-link" study={props.study} >
                    Create a lesson
                  </CreateLessonLink>}
                </div>
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(StudyOverviewPage)
