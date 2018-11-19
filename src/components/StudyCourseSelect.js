import * as React from 'react'
import cls from 'classnames'
import {
  createPaginationContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import Select from '@material/react-select'
import { get, isEmpty } from 'utils'

import { COURSES_PER_PAGE } from 'consts'

class StudyCourseSelect extends React.Component {
  state = {
    value: "",
  }

  handleChange = (e) => {
    const value = e.target.value
    this.setState({value})
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

    relay.loadMore(COURSES_PER_PAGE)
  }

  get classes() {
    const {className} = this.props
    return cls("StudyCourseSelect rn-select", className)
  }

  get options() {
    const courseEdges = get(this.props, "study.courses.edges", [])
    const options = [{
      label: "",
      value: "",
    }]
    courseEdges.map(({node}) => node && options.push({
      label: `${node.number}: ${node.name}`,
      value: node.id,
    }))

    return options
  }

  render() {
    const courseEdges = get(this.props, "study.courses.edges", [])
    const {value} = this.state

    return (
      <Select
        className={this.classes}
        outlined
        label="Select a course"
        value={value}
        onChange={this.handleChange}
        disabled={isEmpty(courseEdges)}
        options={this.options}
      />
    )
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
