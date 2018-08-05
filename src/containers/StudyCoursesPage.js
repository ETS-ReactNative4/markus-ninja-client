import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import environment from 'Environment'
import StudyCourses from 'components/StudyCourses'
import { isNil } from 'utils'

import { LESSONS_PER_PAGE } from 'consts'

const StudyCoursesPageQuery = graphql`
  query StudyCoursesPageQuery(
    $owner: String!,
    $name: String!,
    $count: Int!,
    $after: String
  ) {
    study(owner: $owner, name: $name) {
      id
      resourcePath
      ...StudyCourses_study
    }
  }
`

class StudyCoursesPage extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={StudyCoursesPageQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
          count: LESSONS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            if (isNil(props.study)) {
              return null
            }
            return (
              <div className="StudyCoursesPage">
                <Link
                  className="StudyCoursesPage__new-course"
                  to={props.study.resourcePath + "/courses/new"}
                >
                  New course
                </Link>
                <StudyCourses study={props.study}></StudyCourses>
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default StudyCoursesPage
