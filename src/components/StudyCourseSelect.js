import React, { Component } from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'
import Edge from 'components/Edge'

import { COURSES_PER_PAGE } from 'consts'

class StudyCourseSelect extends Component {
  state = {
    courseId: "",
  }

  render() {
    const { courseId } = this.state
    const courseEdges = get(this.props, "study.courses.edges", [])
    return (
      <div className="StudyCourseSelect mdc-select mdc-select-box">
        <select
          className="mdc-select__native-control"
          value={courseId}
          onChange={this.handleChange}
        >
          <option>Select a course...</option>
          {courseEdges.map(edge =>
            <Edge key={get(edge, "node.id", "")} edge={edge} render={({node}) =>
              <option value={node.id}>{node.number}: {node.name}</option>
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
    const courseId = e.target.value
    this.setState({ courseId })
    this.props.onChange(courseId)
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

    relay.loadMore(COURSES_PER_PAGE)
  }
}

export default createPaginationContainer(StudyCourseSelect,
  {
    study: graphql`
      fragment StudyCourseSelect_study on Study {
        courses(
          first: $count,
          after: $after,
          orderBy:{direction: ASC field:NUMBER}
        ) @connection(key: "StudyCourseSelect_courses") {
          edges {
            node {
              id
              name
              number
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
      query StudyCourseSelectForwardQuery(
        $owner: String!,
        $name: String!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          ...StudyCourseSelect_study
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "study.courses")
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
