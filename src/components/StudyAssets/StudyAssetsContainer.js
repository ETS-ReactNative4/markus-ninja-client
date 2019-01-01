import * as React from 'react'
import PropTypes from 'prop-types'
import {
  createRefetchContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import isEqual from 'lodash.isequal'
import {debounce, get, isNil} from 'utils'

import {ASSETS_PER_PAGE} from 'consts'

class StudyAssetsContainer extends React.Component {
  state = {
    error: null,
    loading: false,
    stale: false,
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.filterBy, this.props.filterBy) ||
        !isEqual(prevProps.orderBy, this.props.orderBy)) {
      this.setState({stale: true})
      this._refetch()
    }
  }

  _loadMore = () => {
    const {loading} = this.state
    const after = get(this.props, "study.assets.pageInfo.endCursor")

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
          stale: false,
        })
      },
      {force: true},
    )
  }, 200)

  get _hasMore() {
    return get(this.props, "study.assets.pageInfo.hasNextPage", false)
  }

  render() {
    const child = React.Children.only(this.props.children)
    const studyAssets = get(this.props, "study.assets", {})
    const {loading, stale} = this.state

    return React.cloneElement(child, {
      assets: {
        dataIsStale: stale,
        edges: studyAssets.edges,
        hasMore: this._hasMore,
        isLoading: loading,
        loadMore: this._loadMore,
        totalCount: studyAssets.totalCount,
      },
    })
  }
}

StudyAssetsContainer.propTypes = {
  count: PropTypes.number,
  orderBy: PropTypes.shape({
    direction: PropTypes.string,
    field: PropTypes.string,
  }),
  filterBy: PropTypes.shape({
    search: PropTypes.string,
  }),
}

StudyAssetsContainer.defaultProps = {
  count: ASSETS_PER_PAGE,
}

export const StudyAssetsProp = PropTypes.shape({
  dataIsStale: PropTypes.bool,
  edges: PropTypes.array,
  idLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
  totalCount: PropTypes.number,
})

export const StudyAssetsPropDefaults = {
  dataIsStale: false,
  edges: [],
  isLoading: false,
  hasMore: false,
  loadMore: () => {},
  totalCount: 0,
}

const refetchContainer = createRefetchContainer(StudyAssetsContainer,
  {
    study: graphql`
      fragment StudyAssetsContainer_study on Study @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"},
        filterBy: {type: "UserAssetFilters"},
        orderBy: {type: "UserAssetOrder"},
        styleCard: {type: "Boolean!"},
        styleList: {type: "Boolean!"},
        styleSelect: {type: "Boolean!"},
      ) {
        assets(first: $count, after: $after, filterBy: $filterBy, orderBy: $orderBy)
        @connection(key: "StudyAssetsContainer_assets", filters: []) {
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
    query StudyAssetsContainerRefetchQuery(
      $owner: String!,
      $name: String!,
      $count: Int!,
      $after: String,
      $filterBy: UserAssetFilters,
      $orderBy: UserAssetOrder,
      $styleCard: Boolean!,
      $styleList: Boolean!,
      $styleSelect: Boolean!,
    ) {
      study(owner: $owner, name: $name) {
        ...StudyAssetsContainer_study @arguments(
          count: $count,
          after: $after,
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
