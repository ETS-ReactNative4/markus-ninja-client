import * as React from 'react'
import cls from 'classnames'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import CoursePreview from 'components/CoursePreview.js'
import StudyCoursesLanding from './StudyCoursesLanding'
import { get } from 'utils'

import { LESSONS_PER_PAGE } from 'consts'

class StudyCourses extends React.Component {
  _loadMore = () => {
    const relay = get(this.props, "relay")
    if (!relay.hasMore()) {
      console.log("Nothing more to load")
      return
    } else if (relay.isLoading()){
      console.log("Request is already pending")
      return
    }

    relay.loadMore(LESSONS_PER_PAGE)
  }

  get classes() {
    const {className} = this.props
    return cls("StudyCourse", className)
  }

  render() {
    const courseEdges = get(this.props, "study.courses.edges", [])
    return (
      <div className={this.classes}>
        {
          courseEdges.length < 1 ? (
            <StudyCoursesLanding study={get(this.props, "study", null)} />
          ) : (
            <div className="StudyCourses__courses">
              {courseEdges.map(({node}) => (
                <CoursePreview key={node.__id} course={node} />
              ))}
              {this.props.relay.hasMore() &&
              <button
                className="StudyCourses__more"
                onClick={this._loadMore}
              >
                More
              </button>}
            </div>
          )
        }
      </div>
    )
  }
}

export default createPaginationContainer(StudyCourses,
  {
    study: graphql`
      fragment StudyCourses_study on Study {
        ...StudyCoursesLanding_study
        courses(
          first: $count,
          after: $after,
          orderBy:{direction: ASC field:CREATED_AT}
        ) @connection(key: "StudyCourses_courses", filters: []) {
          edges {
            node {
              ...CoursePreview_course
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    query: graphql`
      query StudyCoursesForwardQuery(
        $owner: String!,
        $name: String!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          ...StudyCourses_study
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "study.courses")
    },
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables,
        count: totalCount,
      }
    },
    getVariables(props, paginationInfo, getFragmentVariables) {
      return {
        owner: props.match.params.owner,
        name: props.match.params.name,
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    },
  },
)
