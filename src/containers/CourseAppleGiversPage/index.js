import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import {get} from 'utils'
import CourseAppleGivers from './CourseAppleGivers'
import {USERS_PER_PAGE} from 'consts'

const CourseAppleGiversPageQuery = graphql`
  query CourseAppleGiversPageQuery(
    $owner: String!,
    $name: String!,
    $number: Int!,
    $count: Int!,
    $after: String,
  ) {
    study(owner: $owner, name: $name) {
      course(number: $number) {
        ...CourseAppleGivers_course @arguments(
          count: $count,
          after: $after,
        )
      }
    }
  }
`

class CourseAppleGiversPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CourseAppleGiversPage mdc-layout-grid__inner", className)
  }

  render() {
    const { match } = this.props

    return (
      <QueryRenderer
        environment={environment}
        query={CourseAppleGiversPageQuery}
        variables={{
          owner: match.params.owner,
          name: match.params.name,
          number: parseInt(match.params.number, 10),
          count: USERS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className={this.classes}>
                <CourseAppleGivers course={get(props, "study.course", null)} />
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(CourseAppleGiversPage)
