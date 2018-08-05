import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import Course from 'components/Course'
import NotFound from 'components/NotFound'
import { get, isNil } from 'utils'

import { LESSONS_PER_PAGE } from 'consts'

const CoursePageQuery = graphql`
  query CoursePageQuery($owner: String!, $name: String!, $number: Int!, $count: Int!, $after: String) {
    study(owner: $owner, name: $name) {
      course(number: $number) {
        ...Course_course
      }
    }
  }
`

class CoursePage extends Component {
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
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            if (isNil(get(props, "study.course", null))) {
              return <NotFound />
            }
            return (
              <div className="CoursePage">
                <Course course={props.study.course} />
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
