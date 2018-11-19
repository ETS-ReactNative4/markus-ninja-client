import * as React from 'react'
import {
  createPaginationContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { withRouter } from 'react-router'
import UserActivityEvent from 'components/UserActivityEvent'
import { get, isEmpty } from 'utils'

import {USER_ACTIVITY_PER_PAGE} from 'consts'

class UserActivity extends React.Component {
  _loadMore = () => {
    const relay = get(this.props, "relay")
    if (!relay.hasMore()) {
      console.log("Nothing more to load")
      return
    } else if (relay.isLoading()){
      console.log("Request is already pending")
      return
    }

    relay.loadMore(USER_ACTIVITY_PER_PAGE)
  }

  render() {
    return (
      <React.Fragment>
        <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          Recent activity
        </h5>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <div className="mdc-card mdc-card--outlined ph2">
            {this.renderActivity()}
            {this.props.relay.hasMore() &&
            <div className="mdc-card__actions">
              <div className="mdc-card__action-buttons">
                <button
                className="mdc-button mdc-button--unelevated mdc-card__action mdc-card__action--button"
                  onClick={this._loadMore}
                >
                  Load more activity
                </button>
              </div>
            </div>}
          </div>
        </div>
      </React.Fragment>
    )
  }

  renderActivity() {
    const {relay} = this.props
    const edges = get(this.props, "user.activity.edges", [])
    const noResults = isEmpty(edges)

    return (
      <ul className="mdc-list mdc-list--two-line">
        {relay.isLoading() && noResults
        ? <li className="mdc-list-item">Loading...</li>
        : noResults
          ? <li className="mdc-list-item">No recent activity</li>
        : edges.map(({node}) => (
            node &&
            <UserActivityEvent key={node.id} withUser event={node} />
          ))}
      </ul>
    )
  }
}

export default withRouter(createPaginationContainer(UserActivity,
  {
    user: graphql`
      fragment UserActivity_user on User @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"}
      ) {
        activity(
          first: $count,
          after: $after,
          orderBy: {direction: DESC, field: CREATED_AT}
        ) @connection(key: "UserActivity_activity", filters: []) {
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
              ...on PublishedEvent {
                ...PublishedEvent_event
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
      query UserActivityForwardQuery(
        $login: String!,
        $count: Int!,
        $after: String
      ) {
        user(login: $login) {
          ...UserActivity_user @arguments(
            count: $count,
            after: $after
          )
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "user.activity")
    },
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables,
        count: totalCount,
      }
    },
    getVariables(props, paginationInfo, getFragmentVariables) {
      return {
        login: props.match.params.login,
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    },
  },
))
