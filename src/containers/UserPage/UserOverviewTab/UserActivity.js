import * as React from 'react'
import cls from 'classnames'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import UserActivityEvent from 'components/UserActivityEvent'
import { get, isEmpty } from 'utils'

import {USER_ACTIVITY_PER_PAGE} from 'consts'

class UserActivity extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("UserActivity mdc-layout-grid__inner", className)
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

    relay.loadMore(USER_ACTIVITY_PER_PAGE)
  }

  render() {
    const activityEdges = get(this.props, "user.activity.edges", [])
    return (
      <div className={this.classes}>
        <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          Recent activity
        </h5>
        {isEmpty(activityEdges)
        ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            This user has no recent activity.
          </div>
        : <React.Fragment>
            {activityEdges.map(({node}) => (
              node &&
              <UserActivityEvent
                key={node.id}
                className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
                event={node}
              />
            ))}
            {this.props.relay.hasMore() &&
            <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <button
                className="mdc-button mdc-button--unelevated"
                onClick={this._loadMore}
              >
                Load more activity
              </button>
            </div>}
          </React.Fragment>}
      </div>
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
