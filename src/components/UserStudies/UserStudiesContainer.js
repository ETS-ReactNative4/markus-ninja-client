import * as React from 'react'
import PropTypes from 'prop-types'
import {
  createRefetchContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {withRouter} from 'react-router-dom'
import isEqual from 'lodash.isequal'
import {debounce, get, isNil} from 'utils'

import {STUDIES_PER_PAGE} from 'consts'

class UserStudiesContainer extends React.Component {
  state = {
    error: null,
    loading: !Boolean(get(this.props, "user.studies")),
    stale: !Boolean(get(this.props, "user.studies"))
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.filterBy, this.props.filterBy) ||
        !isEqual(prevProps.orderBy, this.props.orderBy)) {
      this._refetch(null, true)
    } else if (!Boolean(get(prevProps, "user.studies")) && Boolean(get(this.props, "user.studies"))) {
      this.setState({loading: false})
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

  _refetch = debounce((after, currentResultsAreStale = false) => {
    const {count, filterBy, isViewer, orderBy, relay} = this.props

    this.setState({
      loading: true,
      stale: currentResultsAreStale,
    })

    relay.refetch(
      {
        after,
        count,
        filterBy,
        isUser: !isViewer,
        isViewer,
        orderBy,
      },
      null,
      (error) => {
        if (!isNil(error)) {
          console.log(error)
        }
        this.setState({
          loading: false,
          stale: false,
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
    const {loading, stale} = this.state

    return React.cloneElement(child, {
      studies: {
        edges: userStudies.edges,
        hasMore: this._hasMore,
        isLoading: loading,
        isStale: stale,
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
  isViewer: PropTypes.bool,
}

UserStudiesContainer.defaultProps = {
  count: STUDIES_PER_PAGE,
  isViewer: false,
}

export const UserStudiesProp = PropTypes.shape({
  edges: PropTypes.array,
  hasMore: PropTypes.bool,
  isLoading: PropTypes.bool,
  isStale: PropTypes.bool,
  loadMore: PropTypes.func,
  totalCount: PropTypes.number,
})

export const UserStudiesPropDefaults = {
  edges: [],
  hasMore: false,
  isLoading: false,
  isStale: false,
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
        styleLink: {type: "Boolean!"},
        stylePreview: {type: "Boolean!"},
      ) {
        studies(first: $count, after: $after, filterBy: $filterBy, orderBy: $orderBy)
        @connection(key: "UserStudiesContainer_studies", filters: ["filterBy", "orderBy"]) {
          edges {
            cursor
            node {
              id
              ...on Study {
                ...StudyLink_study @include(if: $styleLink)
                ...StudyPreview_study @include(if: $stylePreview)
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
      $isUser: Boolean!,
      $isViewer: Boolean!,
      $styleLink: Boolean!,
      $stylePreview: Boolean!,
    ) {
      user(login: $login) @skip(if: $isViewer) {
        ...UserStudiesContainer_user @arguments(
          after: $after,
          count: $count,
          filterBy: $filterBy,
          orderBy: $orderBy,
          styleLink: $styleLink,
          stylePreview: $stylePreview,
        )
      }
      viewer @skip(if: $isUser) {
        ...UserStudiesContainer_user @arguments(
          after: $after,
          count: $count,
          filterBy: $filterBy,
          orderBy: $orderBy,
          styleLink: $styleLink,
          stylePreview: $stylePreview,
        )
      }
    }
  `,
)

export default withRouter(refetchContainer)
