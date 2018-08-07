import React, { Component } from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'
import Edge from 'components/Edge'

import { LABELS_PER_PAGE } from 'consts'

class StudyLabelSelect extends Component {
  state = {
    labelId: "",
  }

  render() {
    const { labelId } = this.state
    const labelEdges = get(this.props, "study.labels.edges", [])
    return (
      <div className="StudyLabelSelect">
        <select
          value={labelId}
          onChange={this.handleChange}
        >
          <option>Select a label...</option>
          {labelEdges.map(edge =>
            <Edge key={get(edge, "node.id", "")} edge={edge} render={({node}) =>
              <option value={node.id}>{node.name}</option>
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
    const labelId = e.target.value
    this.setState({ labelId })
    this.props.onChange(labelId)
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

    relay.loadMore(LABELS_PER_PAGE)
  }
}

export default createPaginationContainer(StudyLabelSelect,
  {
    study: graphql`
      fragment StudyLabelSelect_study on Study {
        labels(
          first: $count,
          after: $after,
        ) @connection(key: "StudyLabelSelect_labels") {
          edges {
            node {
              id
              name
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
      query StudyLabelSelectForwardQuery(
        $owner: String!,
        $name: String!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          ...StudyLabelSelect_study
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "study.labels")
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
        isCourseLabel: props.isCourseLabel,
      }
    },
  },
)
