import * as React from 'react'
import cls from 'classnames'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import UserPreview from 'components/UserPreview'
import {get, isEmpty} from 'utils'

import { USERS_PER_PAGE } from 'consts'

class UserPupils extends React.Component {
  _loadMore = () => {
    const relay = get(this.props, "relay")
    if (!relay.hasMore()) {
      console.log("Nothing more to load")
      return
    } else if (relay.isLoading()){
      console.log("Request is already pending")
      return
    }

    relay.loadMore(USERS_PER_PAGE)
  }

  get classes() {
    const {className} = this.props
    return cls("UserPupils mdc-layout-grid__inner", className)
  }

  render() {
    const user = get(this.props, "user", null)
    const enrolleeEdges = get(user, "enrollees.edges", [])
    return (
      <div className={this.classes}>
        {isEmpty(enrolleeEdges)
        ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            No pupils found.
          </div>
        : <React.Fragment>
            <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
            {enrolleeEdges.map(({node}) => (
              node &&
              <div key={node.id} className="mdc-layout-grid__cell">
                <UserPreview.Tutor user={node} />
                <div className="rn-divider mt4" />
              </div>
            ))}
            {this.props.relay.hasMore() &&
            <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <button
                className="mdc-button mdc-button--unelevated"
                onClick={this._loadMore}
              >
                More
              </button>
            </div>}
          </React.Fragment>}
      </div>
    )
  }
}

export default createPaginationContainer(UserPupils,
  {
    user: graphql`
      fragment UserPupils_user on User @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"},
      ) {
        enrollees(
          first: $count,
          after: $after,
          orderBy:{direction: DESC field: ENROLLED_AT}
        ) @connection(key: "UserPupils_enrollees", filters: []) {
          edges {
            node {
              id
              ...UserPreview_user
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
      query UserPupilsForwardQuery(
        $login: String!,
        $count: Int!,
        $after: String
      ) {
        user(login: $login) {
          ...UserPupils_user @arguments(
            count: $count,
            after: $after,
          )
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "user.enrollees")
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
