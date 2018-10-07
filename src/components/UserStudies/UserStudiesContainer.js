import * as React from 'react'
import PropTypes from 'prop-types'
import {
  createRefetchContainer,
  graphql,
} from 'react-relay'
import {withRouter} from 'react-router-dom'
import isEqual from 'lodash.isequal'
import {debounce, get, isNil} from 'utils'

import {STUDIES_PER_PAGE} from 'consts'

class UserStudiesContainer extends React.Component {
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
    const after = get(this.props, "user.studies.pageInfo.endCursor")

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
    return get(this.props, "user.studies.pageInfo.hasNextPage", false)
  }

  render() {
    const child = React.Children.only(this.props.children)
    const userStudies = get(this.props, "user.studies", {})
    const {loading} = this.state

    return React.cloneElement(child, {
      studies: {
        edges: userStudies.edges,
        hasMore: this._hasMore,
        isLoading: loading,
        loadMore: this._loadMore,
        totalCount: userStudies.totalCount,
      },
    })
  }
}

UserStudiesContainer.propTypes = {
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

UserStudiesContainer.defaultProps = {
  count: STUDIES_PER_PAGE,
}

export const UserStudiesProp = PropTypes.shape({
  edges: PropTypes.array,
  idLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
  totalCount: PropTypes.number,
})

export const UserStudiesPropDefaults = {
  edges: [],
  isLoading: false,
  hasMore: false,
  loadMore: () => {},
  totalCount: 0,
}

const refetchContainer = createRefetchContainer(UserStudiesContainer,
  {
    user: graphql`
      fragment UserStudiesContainer_user on User @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"},
        filterBy: {type: "StudyFilters"},
        orderBy: {type: "StudyOrder"},
      ) {
        studies(first: $count, after: $after, filterBy: $filterBy, orderBy: $orderBy)
        @connection(key: "UserStudiesContainer_studies", filters: ["filterBy", "orderBy"]) {
          edges {
            cursor
            node {
              id
              ...on Study {
                ...StudyPreview_study
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
    query UserStudiesContainerRefetchQuery(
      $login: String!,
      $count: Int!,
      $after: String,
      $filterBy: StudyFilters,
      $orderBy: StudyOrder,
    ) {
      user(login: $login) {
        ...UserStudiesContainer_user @arguments(
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