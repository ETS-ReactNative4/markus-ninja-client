import * as React from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import { get } from 'utils'

import { SEARCH_RESULTS_PER_PAGE } from 'consts'

class SearchStudyResults extends React.Component {
  _loadMore = () => {
    const relay = get(this.props, "relay")
    if (!relay.hasMore()) {
      console.log("Nothing more to load")
      return
    } else if (relay.isLoading()){
      console.log("Request is already pending")
      return
    }

    relay.loadMore(SEARCH_RESULTS_PER_PAGE)
  }

  get _hasMore() {
    return this.props.relay.hasMore()
  }

  get _totalCount() {
    const {type, query} = this.props

    switch (type) {
      case "COURSE":
        return get(query, "search.courseCount", 0)
      case "LABEL":
        return get(query, "search.labelCount", 0)
      case "LESSON":
        return get(query, "search.lessonCount", 0)
      case "USER_ASSET":
        return get(query, "search.userAssetCount", 0)
      default:
        return 0
    }
  }

  render() {
    const child = React.Children.only(this.props.children)

    return React.cloneElement(child, {
      search: {
        edges: get(this.props, "query.search.edges", []),
        totalCount: this._totalCount,
        hasMore: this._hasMore,
        loadMore: this._loadMore,
      }
    })
  }
}

export default withRouter(createPaginationContainer(SearchStudyResults,
  {
    query: graphql`
      fragment SearchStudyResults_query on Query @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"},
        query: {type: "String!"},
        type: {type: "SearchType!"},
      ) {
        search(first: $count, after: $after, query: $query, type: $type)
          @connection(key: "SearchStudy_search", filters: ["type"]) {
          edges {
            node {
              id
              ...on Course {
                ...CoursePreview_course
              }
              ...on Label {
                ...LabelPreview_label
              }
              ...on Lesson {
                ...LessonPreview_lesson
              }
              ...on UserAsset {
                ...UserAssetPreview_asset
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
          courseCount
          labelCount
          lessonCount
          userAssetCount
        }
      }
    `,
  },
  {
    direction: 'forward',
    query: graphql`
      query SearchStudyResultsQuery(
        $count: Int!,
        $after: String,
        $query: String!,
        $type: SearchType!,
      ) {
        ...SearchStudyResults_query @arguments(count: $count, after: $after, query: $query, type: $type)
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
        type: props.type,
      }
    },
  },
))
