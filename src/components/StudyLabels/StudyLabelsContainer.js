import * as React from 'react'
import PropTypes from 'prop-types'
import {
  createRefetchContainer,
  graphql,
} from 'react-relay'
import {withRouter} from 'react-router-dom'
import isEqual from 'lodash.isequal'
import {debounce, get, isNil} from 'utils'

import { LABELS_PER_PAGE } from 'consts'

class StudyLabelsContainer extends React.Component {
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
    const after = get(this.props, "study.labels.pageInfo.endCursor")

    if (!this._hasMore()) {
      console.log("Nothing more to load")
      return
    } else if (loading){
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
    return get(this.props, "study.labels.pageInfo.hasNextPage", false)
  }

  render() {
    const child = React.Children.only(this.props.children)
    const studyLabels = get(this.props, "study.labels", {})
    const {loading} = this.state

    return React.cloneElement(child, {
      labels: {
        edges: studyLabels.edges,
        hasMore: this._hasMore,
        isLoading: loading,
        loadMore: this._loadMore,
        totalCount: studyLabels.totalCount,
      }
    })
  }
}

StudyLabelsContainer.propTypes = {
  count: PropTypes.number,
  orderBy: PropTypes.shape({
    direction: PropTypes.string,
    field: PropTypes.string,
  }),
  filterBy: PropTypes.shape({
    isCourseLabel: PropTypes.bool,
    labels: PropTypes.arrayOf(PropTypes.string),
    search: PropTypes.string,
  }),
}

StudyLabelsContainer.defaultProps = {
  count: LABELS_PER_PAGE,
}

export const StudyLabelsProp = PropTypes.shape({
  edges: PropTypes.array,
  idLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
  totalCount: PropTypes.number,
})

export const StudyLabelsPropDefaults = {
  edges: [],
  isLoading: false,
  hasMore: false,
  loadMore: () => {},
  totalCount: 0,
}

const refetchContainer = createRefetchContainer(StudyLabelsContainer,
  {
    study: graphql`
      fragment StudyLabelsContainer_study on Study @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String!"},
        filterBy: {type: "LabelFilters"},
        orderBy: {type: "LabelOrder"},
      ) {
        labels(first: $count, after: $after, filterBy: $filterBy, orderBy: $orderBy)
        @connection(key: "StudyLabelsContainer_labels", filters: []) {
          edges {
            node {
              id
              ...LabelPreview_label
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
    query StudyLabelsContainerRefetchQuery(
      $owner: String!,
      $name: String!,
      $count: Int!,
      $after: String,
    $filterBy: LabelFilters,
    $orderBy: LabelOrder,
    ) {
      study(owner: $owner, name: $name) {
        ...StudyLabelsContainer_study @arguments(
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
