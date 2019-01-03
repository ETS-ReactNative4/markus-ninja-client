import * as React from 'react'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import CoursePreview from 'components/CoursePreview'
import { get, isEmpty } from 'utils'

class UserPopularCourses extends React.Component {
  render() {
    const courseEdges = get(this.props, "user.courses.edges", [])

    return (
      <React.Fragment>
        <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          Popular courses
        </h5>
        {isEmpty(courseEdges)
        ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            This user has not created any courses yet.
          </div>
        : courseEdges.map(({node}) =>
          node &&
          <div
            key={get(node, "id", "")}
            className="mdc-layout-grid__cell mdc-layout-grid__cell--span-4"
          >
            <CoursePreview.Card className="h-100" course={node} />
          </div>)}
      </React.Fragment>
    )
  }
}

export default createFragmentContainer(UserPopularCourses, graphql`
  fragment UserPopularCourses_user on User {
    courses(first: 4, orderBy:{direction: DESC, field: APPLE_COUNT})
      @connection(key: "UserPopularCourses_courses", filters: []) {
      edges {
        node {
          id
          ...on Course {
            ...CardCoursePreview_course
          }
        }
      }
    }
  }
`)
