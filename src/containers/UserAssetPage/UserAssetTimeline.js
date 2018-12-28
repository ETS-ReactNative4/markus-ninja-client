import React, { Component } from 'react'
import {
  createRefetchContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import UserAssetTimelineEvent from './UserAssetTimelineEvent'
import {debounce, get, groupInOrderByFunc} from 'utils'

import { EVENTS_PER_PAGE } from 'consts'

class UserAssetTimeline extends Component {
  state = {
    error: null,
    loading: false,
  }

  _loadMore = () => {
    const {loading} = this.state
    const after = get(this.props, "asset.timeline.pageInfo.endCursor")

    if (!this._hasMore) {
      console.log("Nothing more to load")
      return
    } else if (loading){
      console.log("Request is already pending")
      return
    }

    this.refetch(after)
  }

  refetch = debounce((after) => {
    const {relay} = this.props

    this.setState({
      loading: true,
    })

    relay.refetch(
      {
        after,
        count: EVENTS_PER_PAGE,
      },
      null,
      (error) => {
        if (error) {
          console.log(error)
        }
        this.setState({
          loading: false,
        })
      },
      {force: true},
    )
  }, 200)

  get _hasMore() {
    return get(this.props, "asset.timeline.pageInfo.hasNextPage", false)
  }

  render() {
    return (
      <React.Fragment>
        {this.renderTimelineEdges()}
        {this._hasMore &&
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <div className="flex justify-center">
            <button
              className="mdc-button mdc-button--unelevated"
              onClick={this._loadMore}
            >
              Load More
            </button>
          </div>
        </div>}
      </React.Fragment>
    )
  }

  renderTimelineEdges() {
    const timelineEdges = groupInOrderByFunc(
      get(this.props, "asset.timeline.edges", []),
      ({node}) => node && node.__typename !== "Comment",
    )

    return (
      <React.Fragment>
        {timelineEdges.map((group) => {
          if (group[0].node.__typename === "Comment") {
            return group.map(({node}) =>
              node &&
              <UserAssetTimelineEvent
                key={node.id}
                className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
                item={node}
              />
            )
          } else {
            return (
              <div key={group[0].node.id} className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                <div className="mdc-card mdc-card--outlined ph2">
                  <ul className="mdc-list">
                    {group.map(({node}) =>
                      node && <UserAssetTimelineEvent key={node.id} item={node} />)}
                  </ul>
                </div>
              </div>
            )
          }
        })}
      </React.Fragment>
    )
  }
}

export default createRefetchContainer(UserAssetTimeline,
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
              ...on Comment {
                ...Comment_comment
              }
              ...on LabeledEvent {
                ...LabeledEvent_event
              }
              ...on ReferencedEvent {
                ...ReferencedEvent_event
              }
              ...on RenamedEvent {
                ...RenamedEvent_event
              }
              ...on UnlabeledEvent {
                ...UnlabeledEvent_event
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
  graphql`
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
)
