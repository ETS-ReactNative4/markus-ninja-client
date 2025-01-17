import * as React from 'react'
import {
  createPaginationContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import UserPreview from 'components/UserPreview'
import {get, isEmpty} from 'utils'

import { USERS_PER_PAGE } from 'consts'

class StudyEnrollees extends React.Component {
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
    return (
      <React.Fragment>
        <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">Enrollees</h5>
        <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <div className="mdc-card mdc-card--outlined ph2">
            {this.renderEnrollees()}
            {this.props.relay.hasMore() &&
            <div className="mdc-card__actions">
              <div className="mdc-card__action-buttons">
                <button
                  className="mdc-button mdc-button--unelevated mdc-card__action mdc-card__action--button"
                  type="button"
                  onClick={this._loadMore}
                >
                  More
                </button>
              </div>
            </div>}
          </div>
        </div>
      </React.Fragment>
    )
  }

  renderEnrollees() {
    const edges = get(this.props, "study.enrollees.edges", [])
    const noResults = isEmpty(edges)

    return (
      <ul className="mdc-list mdc-list--two-line">
        {noResults
        ? <li className="mdc-list-item">No enrollees were found</li>
        : edges.map(({node}) => (
            node && <UserPreview.List key={node.id} user={node} />
          ))}
      </ul>
    )
  }
}

export default createPaginationContainer(StudyEnrollees,
  {
    study: graphql`
      fragment StudyEnrollees_study on Study @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"},
      ) {
        enrollees(
          first: $count,
          after: $after,
          orderBy:{direction: DESC field: ENROLLED_AT}
        ) @connection(key: "StudyEnrollees_enrollees", filters: []) {
          edges {
            node {
              id
              ...ListUserPreview_user
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
      query StudyEnrolleesForwardQuery(
        $owner: String!,
        $name: String!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          ...StudyEnrollees_study @arguments(
            count: $count,
            after: $after,
          )
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "study.enrollees")
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
