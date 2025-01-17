import * as React from 'react'
import PropTypes from 'prop-types'
import {
  createRefetchContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import isEqual from 'lodash.isequal'
import {debounce, get, isNil} from 'utils'

import {ACTIVITIES_PER_PAGE} from 'consts'

class StudyActivitiesContainer extends React.Component {
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
    const after = get(this.props, "study.activities.pageInfo.endCursor")

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
    return get(this.props, "study.activities.pageInfo.hasNextPage", false)
  }

  render() {
    const child = React.Children.only(this.props.children)
    const studyActivities = get(this.props, "study.activities", {})
    const {loading, stale} = this.state

    return React.cloneElement(child, {
      activities: {
        dataIsStale: stale,
        edges: studyActivities.edges,
        hasMore: this._hasMore,
        isLoading: loading,
        loadMore: this._loadMore,
        totalCount: studyActivities.totalCount,
      },
    })
  }
}

StudyActivitiesContainer.propTypes = {
  count: PropTypes.number,
  orderBy: PropTypes.shape({
    direction: PropTypes.string,
    field: PropTypes.string,
  }),
  filterBy: PropTypes.shape({
    search: PropTypes.string,
  }),
}

StudyActivitiesContainer.defaultProps = {
  count: ACTIVITIES_PER_PAGE,
}

export const StudyActivitiesProp = PropTypes.shape({
  dataIsStale: PropTypes.bool,
  edges: PropTypes.array,
  isLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
  totalCount: PropTypes.number,
})

export const StudyActivitiesPropDefaults = {
  dataIsStale: false,
  edges: [],
  isLoading: false,
  hasMore: false,
  loadMore: () => {},
  totalCount: 0,
}

const refetchContainer = createRefetchContainer(StudyActivitiesContainer,
  {
    study: graphql`
      fragment StudyActivitiesContainer_study on Study @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"},
        filterBy: {type: "ActivityFilters"},
        orderBy: {type: "ActivityOrder"},
        styleCard: {type: "Boolean!"},
        styleList: {type: "Boolean!"},
        styleSelect: {type: "Boolean!"},
      ) {
        activities(first: $count, after: $after, filterBy: $filterBy, orderBy: $orderBy)
        @connection(key: "StudyActivitiesContainer_activities", filters: ["filterBy", "orderBy"]) {
          edges {
            cursor
            node {
              id
              ...on Activity {
                ...CardActivityPreview_activity @include(if: $styleCard)
                ...ListActivityPreview_activity @include(if: $styleList)
                ...SelectActivityPreview_activity @include(if: $styleSelect)
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
    query StudyActivitiesContainerRefetchQuery(
      $owner: String!,
      $name: String!,
      $count: Int!,
      $after: String,
      $filterBy: ActivityFilters,
      $orderBy: ActivityOrder,
      $styleCard: Boolean!,
      $styleList: Boolean!,
      $styleSelect: Boolean!,
    ) {
      study(owner: $owner, name: $name) {
        ...StudyActivitiesContainer_study @arguments(
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
