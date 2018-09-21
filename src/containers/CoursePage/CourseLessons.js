import * as React from 'react'
import cls from 'classnames'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import CreateLessonLink from 'components/CreateLessonLink'
import LessonPreview from 'components/LessonPreview'
import {get, isEmpty} from 'utils'

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
    return cls("CourseLessons ", className)
  }

  render() {
    const course = get(this.props, "course", null)
    const lessonEdges = get(course, "lessons.edges", [])
    return (
      <React.Fragment>
        {isEmpty(lessonEdges)
        ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <CreateLessonLink study={course.study}>
              Create a lesson
            </CreateLessonLink>
          </div>
        : <React.Fragment>
            {lessonEdges.map(({node}) => (
              node &&
              <React.Fragment key={node.id}>
                <LessonPreview.Course
                  className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
                  lesson={node}
                />
                <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
              </React.Fragment>
            ))}
            {this.props.relay.hasMore() &&
            <button
              className="CourseLessons__more"
              onClick={this._loadMore}
            >
              More
            </button>}
          </React.Fragment>}
      </React.Fragment>
    )
  }
}

export default createPaginationContainer(CourseLessons,
  {
    course: graphql`
      fragment CourseLessons_course on Course {
        lessons(
          first: $count,
          after: $after,
          orderBy:{direction: ASC field: COURSE_NUMBER}
        ) @connection(key: "CourseLessons_lessons", filters: []) {
          edges {
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
        study {
          ...CreateLessonLink_study
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
            ...CourseLessons_course
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
