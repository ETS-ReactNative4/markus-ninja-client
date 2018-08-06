import React, { Component } from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import CreateLessonLink from 'components/CreateLessonLink'
import StudyLabelsLink from 'components/StudyLabelsLink'
import LessonPreview from './LessonPreview.js'
import { get } from 'utils'

import { LESSONS_PER_PAGE } from 'consts'

class StudyLessons extends Component {
  render() {
    const study = get(this.props, "study", null)
    const lessonEdges = get(study, "lessons.edges", [])
    return (
      <div className="StudyLessons">
        <StudyLabelsLink study={study}>
          Labels
        </StudyLabelsLink>
        {
          lessonEdges.length < 1 ? (
            <CreateLessonLink study={study}>
              Create a lesson
            </CreateLessonLink>
          ) : (
            <div className="StudyLessons__lessons">
              {lessonEdges.map(({node}) => (
                <LessonPreview key={node.__id} lesson={node} />
              ))}
              {this.props.relay.hasMore() &&
              <button
                className="StudyLessons__more"
                onClick={this._loadMore}
              >
                More
              </button>}
            </div>
          )
        }
      </div>
    )
  }

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
}

export default createPaginationContainer(StudyLessons,
  {
    study: graphql`
      fragment StudyLessons_study on Study {
        ...CreateLessonLink_study
        ...StudyLabelsLink_study
        lessons(
          first: $count,
          after: $after,
          orderBy:{direction: ASC field:NUMBER}
        ) @connection(key: "StudyLessons_lessons") {
          edges {
            node {
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
      query StudyLessonsForwardQuery(
        $owner: String!,
        $name: String!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          ...StudyLessons_study
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "study.lessons")
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
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    },
  },
)
