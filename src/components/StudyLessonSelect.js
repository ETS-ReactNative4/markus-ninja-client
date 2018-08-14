import React, { Component } from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'
import Edge from 'components/Edge'
import LessonSelectOption from 'components/LessonSelectOption'

import { LESSONS_PER_PAGE } from 'consts'

class StudyLessonSelect extends Component {
  state = {
    lessonId: "",
  }

  render() {
    const { lessonId } = this.state
    const lessonEdges = get(this.props, "study.lessons.edges", [])
    return (
      <div className="StudyLessonSelect mdc-select mdc-select-box">
        <select
          className="mdc-select__native-control"
          value={lessonId}
          onChange={this.handleChange}
        >
          <option>Select a lesson...</option>
          {lessonEdges.map(edge =>
            <Edge key={get(edge, "node.id", "")} edge={edge} render={({node}) =>
              <LessonSelectOption lesson={node} />
            } />)}
        </select>
        {this.props.relay.hasMore() &&
        <button
          className="btn"
          type="button"
          onClick={this._loadMore}
        >
          More
        </button>}
      </div>
    )
  }

  handleChange = (e) => {
    const lessonId = e.target.value
    this.setState({ lessonId })
    this.props.onChange(lessonId)
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

export default createPaginationContainer(StudyLessonSelect,
  {
    study: graphql`
      fragment StudyLessonSelect_study on Study {
        lessons(
          first: $count,
          after: $after,
          isCourseLesson: $isCourseLesson,
          orderBy:{direction: ASC field:NUMBER}
        ) @connection(key: "StudyLessonSelect_lessons", filters: []) {
          edges {
            node {
              id
              ...LessonSelectOption_lesson
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
      query StudyLessonSelectForwardQuery(
        $owner: String!,
        $name: String!,
        $count: Int!,
        $after: String
        $isCourseLesson: Boolean
      ) {
        study(owner: $owner, name: $name) {
          ...StudyLessonSelect_study
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
        isCourseLesson: props.isCourseLesson,
      }
    },
  },
)
