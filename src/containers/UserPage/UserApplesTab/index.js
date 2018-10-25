import * as React from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import UserCourseApples from './UserCourseApples'
import UserStudyApples from './UserStudyApples'
import {get} from 'utils'
import {COURSES_PER_PAGE, STUDIES_PER_PAGE} from 'consts'

const UserApplesTabQuery = graphql`
  query UserApplesTabQuery(
    $login: String!,
    $courseCount: Int!,
    $studyCount: Int!,
    $afterCourse: String,
    $afterStudy: String,
  ) {
    user(login: $login) {
      ...UserCourseApples_user @arguments(
        count: $courseCount,
        after: $afterCourse,
      )
      ...UserStudyApples_user @arguments(
        count: $studyCount,
        after: $afterStudy,
      )
    }
  }
`

class UserApplesTab extends React.Component {
  render() {
    const { match } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={UserApplesTabQuery}
        variables={{
          login: get(match.params, "login", ""),
          courseCount: COURSES_PER_PAGE,
          studyCount: STUDIES_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <React.Fragment>
                <UserCourseApples user={props.user} />
                <UserStudyApples user={props.user} />
              </React.Fragment>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(UserApplesTab)
