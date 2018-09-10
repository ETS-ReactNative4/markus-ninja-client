import * as React from 'react'
import PropTypes from 'prop-types'
import {
  createRefetchContainer,
  graphql,
} from 'react-relay'
import { debounce, get, isNil, isEmpty } from 'utils'

class SearchStudyRefetchResults extends React.Component {
  state = {
    error: null,
    loading: false,
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.query !== this.props.query) {
      this._refetch(this.props.query)
    }
  }

  _loadMore = () => {
    const { loading, q } = this.state
    const after = get(this.props, "results.search.pageInfo.endCursor")

    if (!this._hasMore()) {
      console.log("Nothing more to load")
      return
    } else if (loading) {
      console.log("Request is already pending")
      return
    }

    this._refetch(q, after)
  }

  _refetch = debounce((query, after) => {
    this.setState({
      loading: true,
    })
    this.props.relay.refetch(
      {
        count: get(this.props, "count", 10),
        after,
        query: isEmpty(query) ? "*" : query,
        within: this.props.studyId,
      },
      null,
      (error) => {
        if (!isNil(error)) {
          console.log(error)
        }
        this.setState({ loading: false })
      },
      {force: true},
    )
  }, 300)

  get _hasMore() {
    return get(this.props, "results.search.pageInfo.hasNextPage", false)
  }

  get _totalCount() {
    const {type, results} = this.props

    switch (type) {
      case "COURSE":
        return get(results, "search.courseCount", 0)
      case "LABEL":
        return get(results, "search.labelCount", 0)
      case "LESSON":
        return get(results, "search.lessonCount", 0)
      case "USER_ASSET":
        return get(results, "search.userAssetCount", 0)
      default:
        return 0
    }
  }

  render() {
    const child = React.Children.only(this.props.children)

    return React.cloneElement(child, {
      search: {
        edges: get(this.props, "results.search.edges", []),
        totalCount: this._totalCount,
        hasMore: this._hasMore,
        loadMore: this._loadMore,
      },
    })
  }
}

SearchStudyRefetchResults.propTypes = {
  query: PropTypes.string,
  studyId: PropTypes.string,
}

SearchStudyRefetchResults.defaultProps = {
  query: "",
  studyId: "",
}

const refetchContainer = createRefetchContainer(SearchStudyRefetchResults,
  {
    results: graphql`
      fragment SearchStudyRefetchResults_results on Query @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"},
        query: {type: "String!"},
        type: {type: "SearchType!"},
        within: {type: "ID!"}
      ) {
        search(first: $count, after: $after, query: $query, type: $type, within: $within)
        @connection(key: "SearchStudyRefetchResults_search", filters: ["type", "within"]) {
          edges {
            cursor
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
  graphql`
    query SearchStudyRefetchResultsRefetchQuery(
      $count: Int!,
      $after: String,
      $query: String!,
      $type: SearchType!,
      $within: ID!
    ) {
      ...SearchStudyRefetchResults_results @arguments(count: $count, after: $after, query: $query, type: $type, within: $within)
    }
  `,
)

export default refetchContainer
