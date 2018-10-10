import * as React from 'react'
import PropTypes from 'prop-types'
import {
  createRefetchContainer,
  graphql,
} from 'react-relay'
import {withRouter} from 'react-router-dom'
import isEqual from 'lodash.isequal'
import {debounce, get, isNil} from 'utils'

import {LESSONS_PER_PAGE} from 'consts'

class CourseLessonsContainer extends React.Component {
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
    const after = get(this.props, "course.lessons.pageInfo.endCursor")

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
    return get(this.props, "course.lessons.pageInfo.hasNextPage", false)
  }

  render() {
    const child = React.Children.only(this.props.children)
    const courseLessons = get(this.props, "course.lessons", {})
    const {loading} = this.state

    return React.cloneElement(child, {
      lessons: {
        edges: courseLessons.edges,
        hasMore: this._hasMore,
        isLoading: loading,
        loadMore: this._loadMore,
        totalCount: courseLessons.totalCount,
      },
    })
  }
}

CourseLessonsContainer.propTypes = {
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

CourseLessonsContainer.defaultProps = {
  count: LESSONS_PER_PAGE,
}

export const CourseLessonsProp = PropTypes.shape({
  edges: PropTypes.array,
  idLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
  totalCount: PropTypes.number,
})

export const CourseLessonsPropDefaults = {
  edges: [],
  isLoading: false,
  hasMore: false,
  loadMore: () => {},
  totalCount: 0,
}

const refetchContainer = createRefetchContainer(CourseLessonsContainer,
  {
    course: graphql`
      fragment CourseLessonsContainer_course on Course @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"},
        filterBy: {type: "LessonFilters"},
        orderBy: {type: "LessonOrder"},
      ) {
        lessons(first: $count, after: $after, filterBy: $filterBy, orderBy: $orderBy)
        @connection(key: "CourseLessonsContainer_lessons", filters: ["filterBy", "orderBy"]) {
          edges {
            cursor
            node {
              id
              ...on Lesson {
                ...LessonPreview_lesson
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
    query CourseLessonsContainerRefetchQuery(
      $owner: String!,
      $name: String!,
      $number: Int!,
      $count: Int!,
      $after: String,
      $filterBy: LessonFilters,
      $orderBy: LessonOrder,
    ) {
      study(owner: $owner, name: $name) {
        course(number: $number) {
          ...CourseLessonsContainer_course @arguments(
            count: $count,
            after: $after,
            filterBy: $filterBy,
            orderBy: $orderBy,
          )
        }
      }
    }
  `,
)

export default withRouter(refetchContainer)
