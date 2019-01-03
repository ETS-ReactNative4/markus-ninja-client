import * as React from 'react'
import PropTypes from 'prop-types'
import {
  createRefetchContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import isEqual from 'lodash.isequal'
import {debounce, get, isNil} from 'utils'

import {ASSETS_PER_PAGE} from 'consts'

class UserAssetsContainer extends React.Component {
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
    const after = get(this.props, "user.assets.pageInfo.endCursor")

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
    const {count, filterBy, isViewer, orderBy, relay} = this.props

    this.setState({
      loading: true,
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
        })
      },
      {force: true},
    )
  }, 200)

  get _hasMore() {
    return get(this.props, "user.assets.pageInfo.hasNextPage", false)
  }

  render() {
    const child = React.Children.only(this.props.children)
    const userAssets = get(this.props, "user.assets", {})
    const {loading} = this.state

    return React.cloneElement(child, {
      assets: {
        edges: userAssets.edges,
        hasMore: this._hasMore,
        isLoading: loading,
        loadMore: this._loadMore,
        totalCount: userAssets.totalCount,
      },
    })
  }
}

UserAssetsContainer.propTypes = {
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

UserAssetsContainer.defaultProps = {
  count: ASSETS_PER_PAGE,
  isViewer: false,
}

export const UserAssetsProp = PropTypes.shape({
  edges: PropTypes.array,
  idLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
  totalCount: PropTypes.number,
})

export const UserAssetsPropDefaults = {
  edges: [],
  isLoading: false,
  hasMore: false,
  loadMore: () => {},
  totalCount: 0,
}

const refetchContainer = createRefetchContainer(UserAssetsContainer,
  {
    user: graphql`
      fragment UserAssetsContainer_user on User @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"},
        filterBy: {type: "UserAssetFilters"},
        orderBy: {type: "UserAssetOrder"},
        styleCard: {type: "Boolean!"},
        styleList: {type: "Boolean!"},
        styleSelect: {type: "Boolean!"},
      ) {
        assets(first: $count, after: $after, filterBy: $filterBy, orderBy: $orderBy)
        @connection(key: "UserAssetsContainer_assets", filters: ["filterBy", "orderBy"]) {
          edges {
            cursor
            node {
              id
              ...on UserAsset {
                ...ListUserAssetPreview_asset @include(if: $styleList)
                ...SelectUserAssetPreview_asset @include(if: $styleSelect)
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
    query UserAssetsContainerRefetchQuery(
      $login: String!,
      $count: Int!,
      $after: String,
      $filterBy: UserAssetFilters,
      $orderBy: UserAssetOrder,
      $isUser: Boolean!,
      $isViewer: Boolean!,
      $styleCard: Boolean!,
      $styleList: Boolean!,
      $styleSelect: Boolean!,
    ) {
      user(login: $login) @skip(if: $isViewer) {
        ...UserAssetsContainer_user @arguments(
          after: $after,
          count: $count,
          filterBy: $filterBy,
          orderBy: $orderBy,
          styleCard: $styleCard,
          styleList: $styleList,
          styleSelect: $styleSelect,
        )
      }
      viewer @skip(if: $isUser) {
        ...UserAssetsContainer_user @arguments(
          after: $after,
          count: $count,
          filterBy: $filterBy,
          orderBy: $orderBy,
          styleCard: $styleCard,
          styleList: $styleList,
          styleSelect: $styleSelect,
        )
      }
    }
  `,
)

export default refetchContainer
