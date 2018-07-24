import React, { Component } from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import Event from './Event.js'
import { get } from 'utils'

import { EVENTS_PER_PAGE } from 'consts'

class LessonEvents extends Component {
  render() {
    const eventEdges = get(this.props, "lesson.events.edges", [])
    return (
      <div className="LessonEvents">
        {eventEdges.map(({node}) => (
          <Event key={node.__id} event={node} />
        ))}
        <button
          className="LessonEvents__more"
          onClick={this._loadMore}
        >
          More
        </button>
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

export default createPaginationContainer(LessonEvents,
  {
    lesson: graphql`
      fragment LessonEvents_lesson on Lesson {
        events(
          first: $count,
          after: $after,
        ) @connection(key: "LessonEvents_events") {
          edges {
            node {
              ...Event_event
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
      query LessonEventsForwardQuery(
        $owner: String!,
        $name: String!,
        $number: Int!,
        $count: Int!,
        $after: String
      ) {
          study(owner: $owner, name: $name) {
            lesson(number: $number) {
              ...LessonEvents_lesson
            }
          }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "lesson.events")
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
