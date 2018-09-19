import React, { Component } from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import LessonTimelineEvent from './LessonTimelineEvent'
import { get } from 'utils'

import { EVENTS_PER_PAGE } from 'consts'

class LessonTimeline extends Component {
  render() {
    const timelineEdges = get(this.props, "lesson.timeline.edges", [])
    return (
      <div className="LessonTimeline flex flex-column">
        {timelineEdges.map(({node}) => (
          <div key={node.id} className="mt3">
            <LessonTimelineEvent item={node} />
          </div>
        ))}
        {this.props.relay.hasMore() &&
        <button
          className="mdc-button mdc-button--unelevated self-center mt3"
          onClick={this._loadMore}
        >
          More
        </button>}
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

    relay.loadMore(EVENTS_PER_PAGE)
  }
}

export default withRouter(createPaginationContainer(LessonTimeline,
  {
    lesson: graphql`
      fragment LessonTimeline_lesson on Lesson {
        timeline(
          first: $count,
          after: $after,
          orderBy: {direction: DESC, field: CREATED_AT}
        ) @connection(key: "LessonTimeline_timeline", filters: []) {
          edges {
            node {
              __typename
              id
              ...on LessonComment {
                ...LessonComment_comment
              }
              ...on ReferencedEvent {
                ...ReferencedEvent_event
              }
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
      query LessonTimelineForwardQuery(
        $owner: String!,
        $name: String!,
        $number: Int!,
        $count: Int!,
        $after: String,
        $filename: String!,
      ) {
        study(owner: $owner, name: $name) {
          lesson(number: $number) {
            ...LessonTimeline_lesson
          }
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "lesson.timeline")
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
        number: parseInt(props.match.params.number, 10),
        count: paginationInfo.count,
        after: paginationInfo.cursor,
        filename: "",
      }
    },
  },
))
