import * as React from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import UserPreview from 'components/UserPreview'
import {get} from 'utils'

import { USERS_PER_PAGE } from 'consts'

class CourseAppleGivers extends React.Component {
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

  render() {
    const course = get(this.props, "course", null)
    const enrolleeEdges = get(course, "appleGivers.edges", [])
    return (
      <React.Fragment>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <ul className="mdc-list mdc-list--two-line">
            {enrolleeEdges.map(({node}) => (
              node && <UserPreview.List key={node.id} user={node} />
            ))}
          </ul>
        </div>
        {this.props.relay.hasMore() &&
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <button
            className="mdc-button mdc-button--unelevated"
            onClick={this._loadMore}
          >
            More
          </button>
        </div>}
      </React.Fragment>
    )
  }
}

export default createPaginationContainer(CourseAppleGivers,
  {
    course: graphql`
      fragment CourseAppleGivers_course on Course @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"},
      ) {
        appleGivers(
          first: $count,
          after: $after,
          orderBy:{direction: DESC field: APPLED_AT}
        ) @connection(key: "CourseAppleGivers_appleGivers", filters: []) {
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
      query CourseAppleGiversForwardQuery(
        $owner: String!,
        $name: String!,
        $number: Int!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          course(number: $number) {
            ...CourseAppleGivers_course @arguments(
              count: $count,
              after: $after,
            )
          }
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "course.appleGivers")
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
