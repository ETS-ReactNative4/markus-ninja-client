import React, {Component} from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import Course from './Course'
import CourseHeader from './CourseHeader'
import CourseMeta from './CourseMeta'
import NotFound from 'components/NotFound'
import { get, isNil } from 'utils'

import { LESSONS_PER_PAGE } from 'consts'

import "./styles.css"

const CoursePageQuery = graphql`
  query CoursePageQuery(
    $owner: String!,
    $name: String!,
    $number: Int!,
    $count: Int!,
    $after: String,
    $isCourseLesson: Boolean
  ) {
    study(owner: $owner, name: $name) {
      course(number: $number) {
        id
        ...CourseHeader_course
        ...CourseMeta_course
        ...Course_course
      }
    }
  }
`

class CoursePage extends Component {
  get classes() {
    const {className} = this.props
    return cls("CoursePage mdc-layout-grid", className)
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={CoursePageQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
          number: parseInt(this.props.match.params.number, 10),
          count: LESSONS_PER_PAGE,
          isCourseLesson: false,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const course = get(props, "study.course", null)
            if (isNil(course)) {
              return <NotFound />
            }
            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__inner">
                  <CourseHeader course={course} />
                  <CourseMeta course={course} />
                  <Course course={course} />
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

export default CoursePage
