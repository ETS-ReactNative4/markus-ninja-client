import * as React from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import UserPreview from 'components/UserPreview'
import {get} from 'utils'

import { USERS_PER_PAGE } from 'consts'

class StudyAppleGivers extends React.Component {
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
    const study = get(this.props, "study", null)
    const enrolleeEdges = get(study, "appleGivers.edges", [])
    return (
      <React.Fragment>
        <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">Apple givers</h5>
        <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
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

export default createPaginationContainer(StudyAppleGivers,
  {
    study: graphql`
      fragment StudyAppleGivers_study on Study @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"},
      ) {
        appleGivers(
          first: $count,
          after: $after,
          orderBy:{direction: DESC field: APPLED_AT}
        ) @connection(key: "StudyAppleGivers_appleGivers", filters: []) {
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
      query StudyAppleGiversForwardQuery(
        $owner: String!,
        $name: String!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          ...StudyAppleGivers_study @arguments(
            count: $count,
            after: $after,
          )
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "study.appleGivers")
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
