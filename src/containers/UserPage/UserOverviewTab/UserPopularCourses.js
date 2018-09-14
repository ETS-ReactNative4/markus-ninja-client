import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import CoursePreview from 'components/CoursePreview'
import { get, isEmpty } from 'utils'

class UserPopularCourses extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("UserPopularCourses mdc-layout-grid__inner", className)
  }

  render() {
    const courseEdges = get(this.props, "query.popularCourses.edges", [])

    return (
      <div className={this.classes}>
        <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          Popular courses
        </h5>
        {isEmpty(courseEdges)
        ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            This user has not created any courses yet.
          </div>
        : courseEdges.map(({node}) =>
          node &&
          <div key={get(node, "id", "")} className={cls(
            "mdc-layout-grid__cell",
            "mdc-layout-grid__cell--span-6-desktop",
            "mdc-layout-grid__cell--span-4-tablet",
            "mdc-layout-grid__cell--span-2-phone",
          )}>
            <CoursePreview.User
              className="mdc-card mdc-card--outlined pa3 h-100"
              course={node}
            />
          </div>)}
      </div>
    )
  }
}

export default createFragmentContainer(UserPopularCourses, graphql`
  fragment UserPopularCourses_query on Query @argumentDefinitions(
    within: {type: "ID!"}
  ) {
    popularCourses: search(first: 6, query: "*", type: COURSE, orderBy:{direction: DESC, field: APPLE_COUNT} within: $within)
      @connection(key: "UserPopularCourses_popularCourses", filters: []) {
      edges {
        node {
          id
          ...on Course {
            ...CoursePreview_course
          }
        }
      }
    }
  }
`)
