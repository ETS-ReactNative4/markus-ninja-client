import * as React from 'react'
import PropTypes from 'prop-types'
import {
  createRefetchContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {withRouter} from 'react-router-dom'
import isEqual from 'lodash.isequal'
import {debounce, get, isNil} from 'utils'

import {TOPICABLES_PER_PAGE} from 'consts'

class TopicTopicablesContainer extends React.Component {
  state = {
    dataIsStale: false,
    error: null,
    loading: false,
    type: this.props.type,
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.search !== this.props.search ||
        prevProps.type !== this.props.type ||
        !isEqual(prevProps.orderBy, this.props.orderBy)) {
      this._refetch()
    }
  }

  _loadMore = () => {
    const {loading} = this.state
    const after = get(this.props, "topic.topicables.pageInfo.endCursor")

    if (!this._hasMore) {
      console.log("Nothing more to load")
      return
    } else if (loading) {
      console.log("Request is already pending")
      return
    }

    this._refetch(after)
  }

  _refetch = debounce((after) => {
    const {type: prevType} = this.state
    const {count, orderBy, relay, search, type} = this.props

    this.setState({
      dataIsStale: prevType !== type,
      loading: true,
      type,
    })

    relay.refetch(
      {
        after,
        count,
        orderBy,
        search,
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
    return get(this.props, "topic.topicables.pageInfo.hasNextPage", false)
  }

  get _counts() {
    const topicables = get(this.props, "topic.topicables", {})

    return {
      course: topicables.courseCount,
      study: topicables.studyCount,
    }
  }

  get _edges() {
    if (this.state.dataIsStale) {
      return []
    }
    return get(this.props, "topic.topicables.edges", [])
  }

  render() {
    const child = React.Children.only(this.props.children)
    const {loading, type} = this.state

    return React.cloneElement(child, {
      topicables: {
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

TopicTopicablesContainer.propTypes = {
  count: PropTypes.number,
  orderBy: PropTypes.shape({
    direction: PropTypes.string,
    field: PropTypes.string,
  }),
  search: PropTypes.string,
  type: PropTypes.string.isRequired,
}

TopicTopicablesContainer.defaultProps = {
  count: TOPICABLES_PER_PAGE,
}

export const TopicTopicablesProp = PropTypes.shape({
  counts: PropTypes.shape({
    course: PropTypes.number,
    study: PropTypes.number,
  }),
  edges: PropTypes.array,
  idLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
  type: PropTypes.string,
})

export const TopicTopicablesPropDefaults = {
  counts: {
    course: 0,
    study: 0,
  },
  edges: [],
  isLoading: false,
  hasMore: false,
  loadMore: () => {},
}

const refetchContainer = createRefetchContainer(TopicTopicablesContainer,
  {
    topic: graphql`
      fragment TopicTopicablesContainer_topic on Topic @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"},
        orderBy: {type: "TopicableOrder"},
        search: {type: "String"},
        type: {type: "TopicableType!"},
      ) {
        topicables(first: $count, after: $after, orderBy: $orderBy, search: $search, type: $type)
        @connection(key: "TopicTopicablesContainer_topicables", filters: ["orderBy", "search", "type"]) {
          edges {
            cursor
            node {
              id
              ...on Course {
                ...CoursePreview_course
              }
              ...on Study {
                ...StudyPreview_study
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
          courseCount
          studyCount
        }
      }
    `,
  },
  graphql`
    query TopicTopicablesContainerRefetchQuery(
      $name: String!,
      $count: Int!,
      $after: String,
      $orderBy: TopicableOrder,
      $search: String,
      $type: TopicableType!
    ) {
      topic(name: $name) {
        ...TopicTopicablesContainer_topic @arguments(
          count: $count,
          after: $after,
          orderBy: $orderBy,
          search: $search,
          type: $type,
        )
      }
    }
  `,
)

export default withRouter(refetchContainer)
