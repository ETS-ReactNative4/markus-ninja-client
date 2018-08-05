import React, { Component } from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import CoursePreview from './CoursePreview.js'
import { get } from 'utils'

import { LESSONS_PER_PAGE } from 'consts'

class StudyCourses extends Component {
  render() {
    const courseEdges = get(this.props, "study.courses.edges", [])
    const resourcePath = get(this.props, "study.resourcePath", "")
    return (
      <div>
        {
          courseEdges.length < 1 ? (
            <Link
              className="StudyCourses__new-course"
              to={resourcePath + "/courses/new"}
            >
              Create a course
            </Link>
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
}

export default createPaginationContainer(StudyCourses,
  {
    study: graphql`
      fragment StudyCourses_study on Study {
        courses(
          first: $count,
          after: $after,
          orderBy:{direction: ASC field:CREATED_AT}
        ) @connection(key: "StudyCourses_courses") {
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
