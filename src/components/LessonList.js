import React, { Component } from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import LessonPreview from './LessonPreview.js'
import { get } from 'utils'

import { LESSONS_PER_PAGE } from 'consts'

class LessonList extends Component {
  render() {
    console.log(LESSONS_PER_PAGE)
    return (
      <div>
        {
          this.props.study.lessons.edges === undefined || this.props.study.lessons.edges.length < 1 ? (
            <Link
              className="LessonList__new-lesson"
              to={this.props.location.pathname + "/new"}
            >
              Create a lesson
            </Link>
          ) : (
            <div className="LessonList__lessons">
              {this.props.study.lessons.edges.map(({node}) => (
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
    if (!this.props.relay.hasMore()) {
      console.log("Nothing more to load")
      return
    } else if (this.props.relay.isLoading()){
      console.log("Request is already pending")
      return
    }

    this.props.relay.loadMore(LESSONS_PER_PAGE)
  }
}

export default withRouter(createPaginationContainer(LessonList,
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
))
