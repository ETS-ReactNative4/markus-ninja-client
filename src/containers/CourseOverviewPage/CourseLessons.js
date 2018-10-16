import * as React from 'react'
import cls from 'classnames'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import LessonPreview from 'components/LessonPreview'
import {get} from 'utils'

import { LESSONS_PER_PAGE } from 'consts'

class CourseLessons extends React.Component {
  _loadMore = () => {
    const relay = get(this.props, "relay")
    if (!relay.hasMore()) {
      console.log("Nothing more to load")
      return
    } else if (relay.isLoading()){
      console.log("Request is already pending")
      return
    }

    relay.loadMore(LESSONS_PER_PAGE)
  }

  get classes() {
    const {className} = this.props
    return cls("CourseLessons mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const course = get(this.props, "course", null)
    const edges = get(course, "lessons.edges", [])

    return (
      <div className={this.classes}>
        <ul className="mdc-list mdc-list--two-line">
          {edges.map(({node}) => (
            node &&
            <LessonPreview.List isCourse key={node.id} lesson={node} />
          ))}
        </ul>
        {this.props.relay.hasMore() &&
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <button
            className="mdc-button mdc-button--unelevated"
            type="button"
            onClick={this._loadMore}
          >
            More
          </button>
        </div>}
      </div>
    )
  }
}

export default createPaginationContainer(CourseLessons,
  {
    course: graphql`
      fragment CourseLessons_course on Course @argumentDefinitions(
        after: {type: "String"},
        count: {type: "Int!"},
      ) {
        id
        lessons(
          first: $count,
          after: $after,
          orderBy:{direction: ASC field: COURSE_NUMBER}
        ) @connection(key: "CourseLessons_lessons", filters: []) {
          edges {
            cursor
            node {
              id
              ...LessonPreview_lesson
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    query: graphql`
      query CourseLessonsForwardQuery(
        $owner: String!,
        $name: String!,
        $number: Int!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          course(number: $number) {
            ...CourseLessons_course @arguments(
              after: $after,
              count: $count,
            )
          }
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "course.lessons")
    },
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables,
        count: totalCount,
      }
    },
    getVariables(props, paginationInfo, getFragmentVariables) {
      return {
        owner: props.match.params.owner,
        name: props.match.params.name,
        number: parseInt(this.props.match.params.number, 10),
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    },
  },
)
