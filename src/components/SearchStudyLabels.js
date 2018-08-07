import React, { Component } from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import pluralize from 'pluralize'
import Edge from 'components/Edge'
import LabelPreview from 'components/LabelPreview'
import Counter from 'components/Counter'
import { get } from 'utils'

import { LESSONS_PER_PAGE } from 'consts'

class SearchStudyLabels extends Component {
  render() {
    const query = get(this.props, "query", null)
    const labelEdges = get(query, "search.edges", [])
    const labelCount = get(query, "search.labelCount", 0)
    return (
      <div className="SearchStudyLabels">
        <h3>
          <Counter>{labelCount}</Counter>
          {pluralize("Labels", labelCount)}
        </h3>
        <div className="SearchStudyLabels__labels">
          {labelEdges.map((edge) => (
            <Edge key={get(edge, "node.id", "")} edge={edge} render={({node}) =>
              <LabelPreview label={node} />}
            />
          ))}
          {this.props.relay.hasMore() &&
          <button
            className="SearchStudyLabels__more"
            onClick={this._loadMore}
          >
            More
          </button>}
        </div>
      </div>
    )
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

    relay.loadMore(LESSONS_PER_PAGE)
  }
}

export default withRouter(createPaginationContainer(SearchStudyLabels,
  {
    query: graphql`
      fragment SearchStudyLabels_query on Query {
        search(first: $count, after: $after, query: $query, type: LABEL, within: $within)
          @connection(key: "SearchStudyLabels_search", filters: []) {
          edges {
            node {
              id
              ...on Label {
                ...LabelPreview_label
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
          labelCount
        }
      }
    `,
  },
  {
    direction: 'forward',
    query: graphql`
      query SearchStudyLabelsQuery(
        $count: Int!,
        $after: String,
        $query: String!,
        $within: ID!
      ) {
        ...SearchStudyLabels_query
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "query.search")
    },
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables,
        count: totalCount,
      }
    },
    getVariables(props, paginationInfo, getFragmentVariables) {
      const searchQuery = queryString.parse(get(props, "location.search", ""))
      const query = get(searchQuery, "q", "*")
      return {
        count: paginationInfo.count,
        after: paginationInfo.cursor,
        query,
        within: props.studyId,
      }
    },
  },
))
