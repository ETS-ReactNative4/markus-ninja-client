import * as React from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import StudyActivityEvent from 'components/StudyActivityEvent'
import { get, isEmpty } from 'utils'

import {STUDY_ACTIVITY_PER_PAGE} from 'consts'

class StudyActivity extends React.Component {
  _loadMore = () => {
    const relay = get(this.props, "relay")
    if (!relay.hasMore()) {
      console.log("Nothing more to load")
      return
    } else if (relay.isLoading()){
      console.log("Request is already pending")
      return
    }

    relay.loadMore(STUDY_ACTIVITY_PER_PAGE)
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
    const edges = get(this.props, "study.activity.edges", [])
    const noResults = isEmpty(edges)

    return (
      <ul className="mdc-list mdc-list--two-line">
        {relay.isLoading() && noResults
        ? <li className="mdc-list-item">Loading...</li>
        : noResults
          ? <li className="mdc-list-item">No recent activity</li>
        : edges.map(({node}) => (
            node &&
            <StudyActivityEvent key={node.id} event={node} />
          ))}
      </ul>
    )
  }
}

export default withRouter(createPaginationContainer(StudyActivity,
  {
    study: graphql`
      fragment StudyActivity_study on Study @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"}
      ) {
        activity(
          first: $count,
          after: $after,
          orderBy: {direction: DESC, field: CREATED_AT}
        ) @connection(key: "StudyActivity_activity", filters: []) {
          edges {
            node {
              __typename
              id
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
      query StudyActivityForwardQuery(
        $owner: String!,
        $name: String!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          ...StudyActivity_study @arguments(
            count: $count,
            after: $after
          )
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "study.activity")
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
))
