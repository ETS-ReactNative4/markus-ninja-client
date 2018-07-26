import React, { Component } from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import StudyPreview from './StudyPreview.js'
import { get } from 'utils'

import { TOPICABLES_PER_PAGE } from 'consts'

class TopicTopicables extends Component {
  render() {
    const topicableEdges = get(this.props, "topic.topicables.edges", [])
    return (
      <div className="TopicTopicables">
        {topicableEdges.map(topicable => (
          <StudyPreview key={topicable.node.id} study={topicable.node} />
        ))}
        <button
          className="TopicTopicables__more"
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

    relay.loadMore(TOPICABLES_PER_PAGE)
  }
}

export default createPaginationContainer(TopicTopicables,
  {
    topic: graphql`
      fragment TopicTopicables_topic on Topic {
        topicables(
          first: $count,
          after: $after,
          type: STUDY
        ) @connection(key: "TopicTopicables_topicables") {
          edges {
            node {
              __typename
              id
              ...on Study {
                ...StudyPreview_study
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
      query TopicTopicablesForwardQuery(
        $name: String!,
        $count: Int!,
        $after: String
      ) {
        topic(name: $name) {
          ...TopicTopicables_topic
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "topic.topicables")
    },
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables,
        count: totalCount,
      }
    },
    getVariables(props, paginationInfo, getFragmentVariables) {
      return {
        name: props.match.params.name,
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    },
  },
)
