import * as React from 'react'
import PropTypes from 'prop-types'
import {
  createRefetchContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {withRouter} from 'react-router-dom'
import isEqual from 'lodash.isequal'
import {debounce, get, isNil} from 'utils'

import {LESSONS_PER_PAGE} from 'consts'

class StudyLessonsContainer extends React.Component {
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
    const after = get(this.props, "study.lessons.pageInfo.endCursor")

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
          stale: false,
          loading: false,
        })
      },
      {force: true},
    )
  }, 200)

  get _hasMore() {
    return get(this.props, "study.lessons.pageInfo.hasNextPage", false)
  }

  render() {
    const child = React.Children.only(this.props.children)
    const studyLessons = get(this.props, "study.lessons", {})
    const {loading, stale} = this.state

    return React.cloneElement(child, {
      lessons: {
        dataIsStale: stale,
        edges: studyLessons.edges,
        hasMore: this._hasMore,
        isLoading: loading,
        loadMore: this._loadMore,
        totalCount: studyLessons.totalCount,
      },
    })
  }
}

StudyLessonsContainer.propTypes = {
  count: PropTypes.number,
  orderBy: PropTypes.shape({
    direction: PropTypes.string,
    field: PropTypes.string,
  }),
  filterBy: PropTypes.shape({
    isCourseLesson: PropTypes.bool,
    labels: PropTypes.arrayOf(PropTypes.string),
    search: PropTypes.string,
  }),
}

StudyLessonsContainer.defaultProps = {
  count: LESSONS_PER_PAGE,
}

export const StudyLessonsProp = PropTypes.shape({
  dataIsStale: PropTypes.bool,
  edges: PropTypes.array,
  isLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
  totalCount: PropTypes.number,
})

export const StudyLessonsPropDefaults = {
  dataIsStale: false,
  edges: [],
  isLoading: false,
  hasMore: false,
  loadMore: () => {},
  totalCount: 0,
}

const refetchContainer = createRefetchContainer(StudyLessonsContainer,
  {
    study: graphql`
      fragment StudyLessonsContainer_study on Study @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"},
        filterBy: {type: "LessonFilters"},
        orderBy: {type: "LessonOrder"},
        styleCard: {type: "Boolean!"},
        styleList: {type: "Boolean!"},
        styleSelect: {type: "Boolean!"},
      ) {
        lessons(first: $count, after: $after, filterBy: $filterBy, orderBy: $orderBy)
        @connection(key: "StudyLessonsContainer_lessons", filters: ["filterBy", "orderBy", "styleCard", "styleList", "styleSelect"]) {
          edges {
            cursor
            node {
              id
              ...on Lesson {
                ...CardLessonPreview_lesson @include(if: $styleCard)
                ...ListLessonPreview_lesson @include(if: $styleList)
                ...SelectLessonPreview_lesson @include(if: $styleSelect)
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
    query StudyLessonsContainerRefetchQuery(
      $owner: String!,
      $name: String!,
      $count: Int!,
      $after: String,
      $filterBy: LessonFilters,
      $orderBy: LessonOrder,
      $styleCard: Boolean!,
      $styleList: Boolean!,
      $styleSelect: Boolean!,
    ) {
      study(owner: $owner, name: $name) {
        ...StudyLessonsContainer_study @arguments(
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

export default withRouter(refetchContainer)
