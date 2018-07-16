import React, { Component } from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import LessonPreview from './LessonPreview.js'
import { get } from 'utils'

import { LESSONS_PER_PAGE } from 'consts'

class LessonList extends Component {
  render() {
    const lessonEdges = get(this.props, "study.lessons.edges", [])
    const resourcePath = get(this.props, "study.resourcePath", "")
    return (
      <div>
        {
          lessonEdges.length < 1 ? (
            <Link
              className="LessonList__new-lesson"
              to={resourcePath + "/lessons/new"}
            >
              Create a lesson
            </Link>
          ) : (
            <div className="LessonList__lessons">
              {lessonEdges.map(({node}) => (
                <LessonPreview key={node.__id} lesson={node} />
              ))}
              <button
                className="LessonList__more"
                onClick={this._loadMore}
              >
                More
              </button>
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

export default createPaginationContainer(LessonList,
  {
    study: graphql`
      fragment LessonList_study on Study {
        lessons(
          first: $count,
          after: $after,
          orderBy:{direction: ASC field:NUMBER}
        ) @connection(key: "LessonList_lessons") {
          edges {
            node {
              ...LessonPreview_lesson
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
      query LessonListForwardQuery(
        $owner: String!,
        $name: String!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          ...LessonList_study
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "study.lessons")
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
