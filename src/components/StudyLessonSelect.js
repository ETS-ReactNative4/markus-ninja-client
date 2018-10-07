import * as React from 'react'
import cls from 'classnames'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import Select from '@material/react-select'
import { get, isEmpty } from 'utils'

import { LESSONS_PER_PAGE } from 'consts'

class StudyLessonSelect extends React.Component {
  state = {
    value: "",
  }

  handleChange = (e) => {
    const value = e.target.value
    this.setState({ value })
    this.props.onChange(value)
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

  get classes() {
    const {className} = this.props
    return cls("StudyLessonSelect", className)
  }

  get options() {
    const lessonEdges = get(this.props, "study.lessons.edges", [])
    const options = [{
      label: "",
      value: "",
    }]
    lessonEdges.map(({node}) => node && options.push({
      label: `${node.number}: ${node.title}`,
      value: node.id,
    }))

    return options
  }

  render() {
    const { value } = this.state
    const lessonEdges = get(this.props, "study.lessons.edges", [])
    return (
      <div className={this.classes}>
        <Select
          className="rn-select"
          outlined
          label="Select a lesson"
          value={value}
          onChange={this.handleChange}
          disabled={isEmpty(lessonEdges)}
          options={this.options}
        />
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
}

export default createPaginationContainer(StudyLessonSelect,
  {
    study: graphql`
      fragment StudyLessonSelect_study on Study @argumentDefinitions(
        after: {type: "String"},
        count: {type: "Int!"},
        filterBy: {type: "LessonFilters"},
      ) {
        lessons(
          after: $after,
          first: $count,
          filterBy: $filterBy,
          orderBy:{direction: ASC field:NUMBER}
        ) @connection(key: "StudyLessonSelect_lessons", filters: []) {
          edges {
            node {
              id
              number
              title
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
        $after: String,
        $filterBy: LessonFilters,
      ) {
        study(owner: $owner, name: $name) {
          ...StudyLessonSelect_study @arguments(
            after: $after,
            count: $count,
            filterBy: $filterBy,
          )
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
        filterBy: props.filterBy,
      }
    },
  },
)
