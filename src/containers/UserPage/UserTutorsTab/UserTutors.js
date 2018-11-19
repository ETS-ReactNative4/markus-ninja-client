import * as React from 'react'
import cls from 'classnames'
import {
  createPaginationContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import UserPreview from 'components/UserPreview'
import {get, isEmpty} from 'utils'

import { USERS_PER_PAGE } from 'consts'

class UserTutors extends React.Component {
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
    return cls("UserTutors mdc-layout-grid__inner", className)
  }

  render() {
    const user = get(this.props, "user", null)
    const enrolledEdges = get(user, "enrolled.edges", [])
    return (
      <div className={this.classes}>
        {isEmpty(enrolledEdges)
        ? (user.isViewer
          ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              You have not enrolled in any users yet.
              If you would like to receive notifications when certain users
              create new studies, then go to their profile page and change your
              enrollment status to Enrolled.
            </div>
          : <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              No tutors found.
            </div>)
        : <React.Fragment>
            <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
            {enrolledEdges.map(({node}) => (
              node &&
              <div key={node.id} className="mdc-layout-grid__cell">
                <div className="flex flex-column h-100">
                  <UserPreview.Tutor className="flex-auto" user={node} />
                  <div className="rn-divider mt4" />
                </div>
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

export default createPaginationContainer(UserTutors,
  {
    user: graphql`
      fragment UserTutors_user on User @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"},
      ) {
        enrolled(
          first: $count,
          after: $after,
          orderBy: {direction: DESC field: ENROLLED_AT}
          type: USER
        ) @connection(key: "UserTutors_enrolled", filters: []) {
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
        isViewer
      }
    `,
  },
  {
    direction: 'forward',
    query: graphql`
      query UserTutorsForwardQuery(
        $login: String!,
        $count: Int!,
        $after: String
      ) {
        user(login: $login) {
          ...UserTutors_user @arguments(
            count: $count,
            after: $after,
          )
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "user.enrolled")
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
