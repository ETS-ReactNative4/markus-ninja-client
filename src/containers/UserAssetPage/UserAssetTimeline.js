import React, { Component } from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import UserAssetTimelineEvent from './UserAssetTimelineEvent'
import { get } from 'utils'

import { EVENTS_PER_PAGE } from 'consts'

class UserAssetTimeline extends Component {
  render() {
    const timelineEdges = get(this.props, "asset.timeline.edges", [])
    return (
      <div className="mdc-card mdc-card--outlined ph2">
        <ul className="mdc-list">
          {timelineEdges.map(({node}) => (
            node &&
            <UserAssetTimelineEvent key={node.id} item={node} />
          ))}
        </ul>
        {this.props.relay.hasMore() &&
        <div className="mdc-card__actions">
          <div className="mdc-card__action-buttons">
            <button
              className="UserAssetTimeline__more"
              onClick={this._loadMore}
            >
              Load More
            </button>
          </div>
        </div>}
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

export default withRouter(createPaginationContainer(UserAssetTimeline,
  {
    asset: graphql`
      fragment UserAssetTimeline_asset on UserAsset {
        timeline(
          first: $count,
          after: $after,
          orderBy: {direction: DESC, field: CREATED_AT}
        ) @connection(key: "UserAssetTimeline_timeline", filters: []) {
          edges {
            node {
              __typename
              id
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
      query UserAssetTimelineForwardQuery(
        $owner: String!,
        $name: String!,
        $filename: String!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          asset(name: $filename) {
            ...UserAssetTimeline_asset
          }
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "asset.timeline")
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
        filename: props.match.params.filename,
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    },
  },
))
