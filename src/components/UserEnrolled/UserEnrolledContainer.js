import * as React from 'react'
import PropTypes from 'prop-types'
import {
  createRefetchContainer,
  graphql,
} from 'react-relay'
import {withRouter} from 'react-router-dom'
import isEqual from 'lodash.isequal'
import {debounce, get, isNil} from 'utils'

import {ENROLLEDS_PER_PAGE} from 'consts'

class UserEnrolledContainer extends React.Component {
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
    const after = get(this.props, "user.enrolled.pageInfo.endCursor")

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
    return get(this.props, "user.enrolled.pageInfo.hasNextPage", false)
  }

  get _counts() {
    const enrolled = get(this.props, "user.enrolled", {})

    return {
      lesson: enrolled.lessonCount,
      study: enrolled.studyCount,
      user: enrolled.userCount,
    }
  }

  get _edges() {
    if (this.state.dataIsStale) {
      return []
    }
    return get(this.props, "user.enrolled.edges", [])
  }

  render() {
    const child = React.Children.only(this.props.children)
    const {loading, type} = this.state

    return React.cloneElement(child, {
      enrolled: {
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

UserEnrolledContainer.propTypes = {
  count: PropTypes.number,
  orderBy: PropTypes.shape({
    direction: PropTypes.string,
    field: PropTypes.string,
  }),
  search: PropTypes.string,
  type: PropTypes.string.isRequired,
}

UserEnrolledContainer.defaultProps = {
  count: ENROLLEDS_PER_PAGE,
}

export const UserEnrolledProp = PropTypes.shape({
  counts: PropTypes.shape({
    lesson: PropTypes.number,
    study: PropTypes.number,
    user: PropTypes.number,
  }),
  edges: PropTypes.array,
  idLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
  type: PropTypes.string,
})

export const UserEnrolledPropDefaults = {
  counts: {
    lesson: 0,
    study: 0,
    user: 0,
  },
  edges: [],
  isLoading: false,
  hasMore: false,
  loadMore: () => {},
}

const refetchContainer = createRefetchContainer(UserEnrolledContainer,
  {
    user: graphql`
      fragment UserEnrolledContainer_user on User @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"},
        orderBy: {type: "EnrollableOrder"},
        search: {type: "String"},
        type: {type: "EnrollableType!"},
      ) {
        enrolled(first: $count, after: $after, orderBy: $orderBy, search: $search, type: $type)
        @connection(key: "UserEnrolledContainer_enrolled", filters: ["orderBy", "search", "type"]) {
          edges {
            cursor
            node {
              id
              ...on Lesson {
                ...ListLessonPreview_lesson
              }
              ...on Study {
                ...StudyPreview_study
              }
              ...on User {
                ...UserPreview_user
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
          lessonCount
          studyCount
          userCount
        }
      }
    `,
  },
  graphql`
    query UserEnrolledContainerRefetchQuery(
      $login: String!,
      $count: Int!,
      $after: String,
      $orderBy: EnrollableOrder,
      $search: String,
      $type: EnrollableType!
    ) {
      user(login: $login) {
        ...UserEnrolledContainer_user @arguments(
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
