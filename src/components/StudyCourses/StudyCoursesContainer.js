import * as React from 'react'
import PropTypes from 'prop-types'
import {
  createRefetchContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {withRouter} from 'react-router-dom'
import isEqual from 'lodash.isequal'
import {debounce, get, isNil} from 'utils'

import {COURSES_PER_PAGE} from 'consts'

class StudyCoursesContainer extends React.Component {
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
    const after = get(this.props, "study.courses.pageInfo.endCursor")

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
    return get(this.props, "study.courses.pageInfo.hasNextPage", false)
  }

  render() {
    const child = React.Children.only(this.props.children)
    const studyCourses = get(this.props, "study.courses", {})
    const {loading, stale} = this.state

    return React.cloneElement(child, {
      courses: {
        dataIsStale: stale,
        edges: studyCourses.edges,
        hasMore: this._hasMore,
        isLoading: loading,
        loadMore: this._loadMore,
        totalCount: studyCourses.totalCount,
      },
    })
  }
}

StudyCoursesContainer.propTypes = {
  count: PropTypes.number,
  orderBy: PropTypes.shape({
    direction: PropTypes.string,
    field: PropTypes.string,
  }),
  filterBy: PropTypes.shape({
    isCourseCourse: PropTypes.bool,
    labels: PropTypes.arrayOf(PropTypes.string),
    search: PropTypes.string,
  }),
}

StudyCoursesContainer.defaultProps = {
  count: COURSES_PER_PAGE,
}

export const StudyCoursesProp = PropTypes.shape({
  dataIsStale: PropTypes.bool,
  edges: PropTypes.array,
  isLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
  totalCount: PropTypes.number,
})

export const StudyCoursesPropDefaults = {
  dataIsStale: false,
  edges: [],
  isLoading: false,
  hasMore: false,
  loadMore: () => {},
  totalCount: 0,
}

const refetchContainer = createRefetchContainer(StudyCoursesContainer,
  {
    study: graphql`
      fragment StudyCoursesContainer_study on Study @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"},
        filterBy: {type: "CourseFilters"},
        orderBy: {type: "CourseOrder"},
        styleCard: {type: "Boolean!"},
        styleList: {type: "Boolean!"},
        styleSelect: {type: "Boolean!"},
      ) {
        courses(first: $count, after: $after, filterBy: $filterBy, orderBy: $orderBy)
        @connection(key: "StudyCoursesContainer_courses", filters: ["filterBy", "orderBy"]) {
          edges {
            cursor
            node {
              id
              ...on Course {
                ...CardCoursePreview_course @include(if: $styleCard)
                ...ListCoursePreview_course @include(if: $styleList)
                ...SelectCoursePreview_course @include(if: $styleSelect)
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
    query StudyCoursesContainerRefetchQuery(
      $owner: String!,
      $name: String!,
      $count: Int!,
      $after: String,
      $filterBy: CourseFilters,
      $orderBy: CourseOrder,
      $styleCard: Boolean!,
      $styleList: Boolean!,
      $styleSelect: Boolean!,
    ) {
      study(owner: $owner, name: $name) {
        ...StudyCoursesContainer_study @arguments(
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
