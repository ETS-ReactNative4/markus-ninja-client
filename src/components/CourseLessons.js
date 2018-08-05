import React, { Component } from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import CourseLessonPreview from './CourseLessonPreview'
import { get } from 'utils'

import { LESSONS_PER_PAGE } from 'consts'

class CourseLessons extends Component {
  render() {
    const lessonEdges = get(this.props, "course.lessons.edges", [])
    const resourcePath = get(this.props, "course.resourcePath", "")
    return (
      <div>
        {
          lessonEdges.length < 1 ? (
            <Link
              className="CourseLessons__new-lesson"
              to={resourcePath + "/lessons/new"}
            >
              Create a lesson
            </Link>
          ) : (
            <div className="CourseLessons__lessons">
              {lessonEdges.map(({node}) => (
                <CourseLessonPreview key={node.__id} lesson={node} />
              ))}
              {this.props.relay.hasMore() &&
              <button
                className="CourseLessons__more"
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

export default createPaginationContainer(CourseLessons,
  {
    course: graphql`
      fragment CourseLessons_course on Course {
        lessons(
          first: $count,
          after: $after,
          orderBy:{direction: ASC field:NUMBER}
        ) @connection(key: "CourseLessons_lessons") {
          edges {
            node {
              ...CourseLessonPreview_lesson
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
      query CourseLessonsForwardQuery(
        $owner: String!,
        $name: String!,
        $number: Int!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          course(number: $number) {
            ...CourseLessons_course
          }
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "course.lessons")
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
        number: parseInt(this.props.match.params.number, 10),
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    },
  },
)
