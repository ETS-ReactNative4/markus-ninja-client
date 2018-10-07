import * as React from 'react'
import PropTypes from 'prop-types'
import {
  createRefetchContainer,
  graphql,
} from 'react-relay'
import {withRouter} from 'react-router-dom'
import isEqual from 'lodash.isequal'
import {debounce, get, isNil} from 'utils'

import {USERS_PER_PAGE} from 'consts'

class UserEnrolleesContainer extends React.Component {
  state = {
    error: null,
    loading: false,
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.filterBy, this.props.filterBy) ||
        !isEqual(prevProps.orderBy, this.props.orderBy)) {
      this._refetch()
    }
  }

  _loadMore = () => {
    const {loading} = this.state
    const after = get(this.props, "user.enrollees.pageInfo.endCursor")

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
    const {count, filterBy, orderBy, relay} = this.props

    this.setState({
      loading: true,
    })

    relay.refetch(
      {
        after,
        count,
        filterBy,
        orderBy,
      },
      null,
      (error) => {
        if (!isNil(error)) {
          console.log(error)
        }
        this.setState({
          loading: false,
        })
      },
      {force: true},
    )
  }, 200)

  get _hasMore() {
    return get(this.props, "user.enrollees.pageInfo.hasNextPage", false)
  }

  render() {
    const child = React.Children.only(this.props.children)
    const userEnrollees = get(this.props, "user.enrollees", {})
    const {loading} = this.state

    return React.cloneElement(child, {
      enrollees: {
        edges: userEnrollees.edges,
        hasMore: this._hasMore,
        isLoading: loading,
        loadMore: this._loadMore,
        totalCount: userEnrollees.totalCount,
      },
    })
  }
}

UserEnrolleesContainer.propTypes = {
  count: PropTypes.number,
  orderBy: PropTypes.shape({
    direction: PropTypes.string,
    field: PropTypes.string,
  }),
  filterBy: PropTypes.shape({
    topics: PropTypes.arrayOf(PropTypes.string),
    search: PropTypes.string,
  }),
}

UserEnrolleesContainer.defaultProps = {
  count: USERS_PER_PAGE,
}

export const UserEnrolleesProp = PropTypes.shape({
  edges: PropTypes.array,
  idLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
  totalCount: PropTypes.number,
})

export const UserEnrolleesPropDefaults = {
  edges: [],
  isLoading: false,
  hasMore: false,
  loadMore: () => {},
  totalCount: 0,
}

const refetchContainer = createRefetchContainer(UserEnrolleesContainer,
  {
    user: graphql`
      fragment UserEnrolleesContainer_user on User @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"},
        filterBy: {type: "UserFilters"},
        orderBy: {type: "UserOrder"},
      ) {
        enrollees(first: $count, after: $after, filterBy: $filterBy, orderBy: $orderBy)
        @connection(key: "UserEnrolleesContainer_enrollees", filters: ["filterBy", "orderBy"]) {
          edges {
            cursor
            node {
              id
              ...on User {
                ...UserPreview_user
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
          totalCount
        }
      }
    `,
  },
  graphql`
    query UserEnrolleesContainerRefetchQuery(
      $login: String!,
      $count: Int!,
      $after: String,
      $filterBy: UserFilters,
      $orderBy: UserOrder,
    ) {
      user(login: $login) {
        ...UserEnrolleesContainer_user @arguments(
          count: $count,
          after: $after,
          filterBy: $filterBy,
          orderBy: $orderBy,
        )
      }
    }
  `,
)

export default withRouter(refetchContainer)
