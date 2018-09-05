import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import StudyCourses from './StudyCourses'
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
      ...StudyCourses_study
    }
  }
`

class StudyCoursesPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudyCoursesPage", className)
  }

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
              <div className={this.classes}>
                <StudyCourses study={props.study} />
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
