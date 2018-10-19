import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { withRouter } from 'react-router'
import { get } from 'utils'
import CourseLessons from './CourseLessons'
import CourseMeta from './CourseMeta'
// import AddCourseLessonForm from './AddCourseLessonForm'
import {isNil} from 'utils'

import {LESSONS_PER_PAGE, TOPICS_PER_PAGE} from 'consts'

import "./styles.css"

const CourseOverviewPageQuery = graphql`
  query CourseOverviewPageQuery(
    $owner: String!,
    $name: String!,
    $number: Int!,
    $lessonCount: Int!,
    $afterLesson: String,
    $topicCount: Int!,
    $afterTopic: String,
  ) {
    study(owner: $owner, name: $name) {
      course(number: $number) {
        ...CourseLessons_course @arguments(
          after: $afterLesson,
          count: $lessonCount,
        )
        ...CourseMeta_course @arguments(
          after: $afterTopic,
          count: $topicCount,
        )
      }
    }
  }
`

class CourseOverviewPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CourseOverviewPage mdc-layout-grid__inner", className)
  }

  render() {
    const course = get(this.props, "course", null)
    if (isNil(course)) {
      return null
    }
    return (
      <QueryRenderer
        environment={environment}
        query={CourseOverviewPageQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
          number: parseInt(this.props.match.params.number, 10),
          lessonCount: LESSONS_PER_PAGE,
          topicCount: TOPICS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const course = get(props, "study.course", null)
            if (!course) {
              return null
            }

            return (
              <div className={this.classes}>
                <CourseMeta course={course} />
                {/*<div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <AddCourseLessonForm course={course} />
                </div>*/}
                <CourseLessons course={course} />
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(CourseOverviewPage)
