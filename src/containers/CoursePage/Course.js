import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { withRouter } from 'react-router'
import { get } from 'utils'
import CourseLessons from './CourseLessons'
import AddCourseLessonForm from './AddCourseLessonForm'
import {isNil} from 'utils'

import { LESSONS_PER_PAGE } from 'consts'

const CourseQuery = graphql`
  query CourseQuery(
    $owner: String!,
    $name: String!,
    $number: Int!,
    $count: Int!,
    $after: String,
    $filterLessonsBy: LessonFilters!,
    $skip: Boolean!,
  ) {
    study(owner: $owner, name: $name) @skip(if: $skip) {
      course(number: $number) {
        ...AddCourseLessonForm_course @arguments(
          after: $after,
          count: $count,
          filterBy: $filterLessonsBy,
        )
      }
    }
  }
`

class Course extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("Course mdc-layout-grid__inner", className)
  }

  render() {
    const course = get(this.props, "course", null)
    if (isNil(course)) {
      return null
    }
    return (
      <QueryRenderer
        environment={environment}
        query={CourseQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
          number: parseInt(this.props.match.params.number, 10),
          count: LESSONS_PER_PAGE,
          filterLessonsBy: {
            isCourseLesson: false,
          },
          skip: !get(this.props, "course.viewerCanAdmin", false),
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const fragmentCourse = get(this.props, "course", null)
            const queryCourse = get(props, "study.course", null)
            return (
              <React.Fragment>
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <AddCourseLessonForm course={queryCourse} />
                </div>
                <CourseLessons course={fragmentCourse} />
              </React.Fragment>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(createFragmentContainer(Course, graphql`
  fragment Course_course on Course @argumentDefinitions(
    after: {type: "String"},
    count: {type: "Int!"},
  ) {
    ...CourseLessons_course @arguments(
      after: $after,
      count: $count,
    )
    viewerCanAdmin
  }
`))
