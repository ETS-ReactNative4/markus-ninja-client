import * as React from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import UserActivityEvent from 'components/UserActivityEvent'
import { get, isEmpty } from 'utils'

import { EVENTS_PER_PAGE } from 'consts'

class ViewerReceivedActivity extends React.Component {
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

  render() {
    const edges = get(this.props, "viewer.receivedActivity.edges", [])
    return (
      <React.Fragment>
        <h4 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          Recent activity
        </h4>
        <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
        {isEmpty(edges)
          ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              There is no recent activity.
            </div>
          : <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <ul className="mdc-list mdc-list--two-line">
                {edges.map(({node}) => (
                  node &&
                  <UserActivityEvent key={node.id} withUser event={node} />
                ))}
              </ul>
              {this.props.relay.hasMore() &&
              <button
                className="mdc-button mdc-button--unelevated"
                onClick={this._loadMore}
              >
                Load more activity
              </button>}
            </div>}
      </React.Fragment>
    )
  }
}

export default withRouter(createPaginationContainer(ViewerReceivedActivity,
  {
    viewer: graphql`
      fragment ViewerReceivedActivity_viewer on User @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"}
      ) {
        receivedActivity(
          first: $count,
          after: $after,
          orderBy: {direction: DESC, field: CREATED_AT}
        ) @connection(key: "ViewerReceivedActivity_receivedActivity", filters: []) {
          edges {
            node {
              __typename
              id
              ...on AppledEvent {
                ...AppledEvent_event
              }
              ...on CreatedEvent {
                ...CreatedEvent_event
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
      query ViewerReceivedActivityForwardQuery(
        $count: Int!,
        $after: String
      ) {
        viewer {
          ...ViewerReceivedActivity_viewer @arguments(
            count: $count,
            after: $after
          )
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "viewer.activity")
    },
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables,
        count: totalCount,
      }
    },
    getVariables(props, paginationInfo, getFragmentVariables) {
      return {
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    },
  },
))
