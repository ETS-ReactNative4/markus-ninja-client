import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import environment from 'Environment'
import StudyLessons from 'components/StudyLessons'

import { LESSONS_PER_PAGE } from 'consts'

const StudyLessonsPageQuery = graphql`
  query StudyLessonsPageQuery(
    $owner: String!,
    $name: String!,
    $count: Int!,
    $after: String
  ) {
    study(owner: $owner, name: $name) {
      id
      resourcePath
      ...StudyLessons_study
    }
  }
`

class StudyLessonsPage extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={StudyLessonsPageQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
          count: LESSONS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div>
                <Link
                  className="StudyLessonsPage__new-lesson"
                  to={props.study.resourcePath + "/lessons/new"}
                >
                  New lesson
                </Link>
                <StudyLessons study={props.study}></StudyLessons>
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default StudyLessonsPage
