import * as React from 'react'
import PropTypes from 'prop-types'
import {
  createRefetchContainer,
  graphql,
} from 'react-relay'
import { debounce, get, isNil, isEmpty } from 'utils'

class SearchContainer extends React.Component {
  state = {
    dataIsStale: false,
    error: null,
    loading: false,
    type: this.props.type,
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.query !== this.props.query ||
        prevProps.type !== this.props.type ||
        prevProps.orderBy !== this.props.orderBy) {
      this._refetch(this.props.query)
    }
  }

  _loadMore = () => {
    const { loading, q } = this.state
    const after = get(this.props, "results.search.pageInfo.endCursor")

    if (!this._hasMore) {
      console.log("Nothing more to load")
      return
    } else if (loading) {
      console.log("Request is already pending")
      return
    }

    this._refetch(q, after)
  }

  _refetch = debounce((query, after) => {
    const {type: prevType} = this.state
    const {orderBy, relay, type} = this.props

    this.setState({
      dataIsStale: prevType !== type,
      loading: true,
      type,
    })

    relay.refetch(
      {
        count: get(this.props, "count", 10),
        after,
        query: isEmpty(query) ? "*" : query,
        orderBy,
        type,
      },
      null,
      (error) => {
        if (!isNil(error)) {
          console.log(error)
        }
        this.setState({
          dataIsStale: false,
          loading: false,
        })
      },
      {force: true},
    )
  }, 200)

  get _hasMore() {
    return get(this.props, "results.search.pageInfo.hasNextPage", false)
  }

  get _counts() {
    const search = get(this.props, "results.search", {})

    return {
      course: search.courseCount,
      label: search.labelCount,
      lesson: search.lessonCount,
      study: search.studyCount,
      topic: search.topicCount,
      user: search.userCount,
      userAsset: search.userAssetCount,
    }
  }

  get _edges() {
    if (this.state.dataIsStale) {
      return []
    }
    return get(this.props, "results.search.edges", [])
  }

  render() {
    const child = React.Children.only(this.props.children)
    const {loading, type} = this.state

    return React.cloneElement(child, {
      search: {
        counts: this._counts,
        edges: this._edges,
        hasMore: this._hasMore,
        isLoading: loading,
        loadMore: this._loadMore,
        type,
      },
    })
  }
}

SearchContainer.propTypes = {
  query: PropTypes.string,
  type: PropTypes.string.isRequired,
}

SearchContainer.defaultProps = {
  query: "*",
}

export const SearchProp = PropTypes.shape({
  counts: PropTypes.shape({
    course: PropTypes.number,
    label: PropTypes.number,
    lesson: PropTypes.number,
    study: PropTypes.number,
    topic: PropTypes.number,
    user: PropTypes.number,
    userAsset: PropTypes.number,
  }),
  edges: PropTypes.array,
  idLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
  type: PropTypes.string.isRequired,
})

export const SearchPropDefaults = {
  counts: {
    course: 0,
    label: 0,
    lesson: 0,
    study: 0,
    topic: 0,
    user: 0,
    userAsset: 0,
  },
  edges: [],
  isLoading: false,
  hasMore: false,
  loadMore: () => {},
}

const refetchContainer = createRefetchContainer(SearchContainer,
  {
    results: graphql`
      fragment SearchContainer_results on Query @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"},
        orderBy: {type: "SearchOrder"},
        query: {type: "String!"},
        type: {type: "SearchType!"},
      ) {
        search(first: $count, after: $after, orderBy: $orderBy, query: $query, type: $type)
        @connection(key: "SearchContainer_search", filters: ["orderBy", "type"]) {
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
                ...ListLessonPreview_lesson
              }
              ...on Study {
                ...StudyPreview_study
              }
              ...on Topic {
                ...TopicPreview_topic
              }
              ...on User {
                ...UserPreview_user
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
          studyCount
          topicCount
          userCount
          userAssetCount
        }
      }
    `,
  },
  graphql`
    query SearchContainerRefetchQuery(
      $count: Int!,
      $after: String,
      $orderBy: SearchOrder,
      $query: String!,
      $type: SearchType!,
    ) {
      ...SearchContainer_results @arguments(
        count: $count,
        after: $after,
        orderBy: $orderBy,
        query: $query,
        type: $type,
      )
    }
  `,
)

export default refetchContainer
