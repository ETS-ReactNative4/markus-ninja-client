import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
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
    if (prevProps.query && !this.props.query) {
      this._refetch(this.props.query)
    }
  }

  _loadMore = () => {
    const { loading, q } = this.state
    const after = get(this.props, "query.search.pageInfo.endCursor")

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
    this.props.onQuery(query)
    this.props.relay.refetch(
      {
        count: get(this.props, "count", 10),
        after,
        query: isEmpty(query) ? "*" : query,
        within: get(this.props, "study.id"),
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
    return get(this.props, "query.search.pageInfo.hasNextPage", false)
  }

  get classes() {
    const {className} = this.props
    return cls("SearchStudyRefetchResults h-100", className)
  }

  render() {
    const child = React.Children.only(this.props.children)

    return React.cloneElement(child, {
      search: {
        edges: get(this.props, "query.search.edges", []),
        hasMore: this._hasMore,
        loadMore: this._loadMore,
      }
    })
  }
}

const refetchContainer = createRefetchContainer(SearchStudyRefetchResults,
  {
    query: graphql`
      fragment SearchStudyRefetchResults_query on Query @argumentDefinitions(
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
  graphql`
    query SearchStudyRefetchResultsRefetchQuery(
      $count: Int!,
      $after: String,
      $query: String!,
      $type: SearchType!,
      $within: ID!
    ) {
      ...SearchStudyRefetchResults_query @arguments(count: $count, after: $after, query: $query, type: $type, within: $within)
    }
  `,
)

export default createFragmentContainer(refetchContainer, graphql`
  fragment SearchStudyRefetchResults_study on Study {
    id
  }
`)
