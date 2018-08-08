import React, { Component } from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'
import Edge from 'components/Edge'

import { LABELS_PER_PAGE } from 'consts'

class StudyLabelChecklist extends Component {
  constructor(props) {
    super(props)

    const studyLabelEdges = get(this.props, "study.labels.edges", [])
    const labelOptions = studyLabelEdges.reduce(
      (r, v, i, a, k = get(v, "node.id", "")) => {
        r[k] = false
        return r
      },
      {},
    )
    const labelableLabelEdges = get(this.props, "labelable.labels.edges", [])
    const labelableLabels = labelableLabelEdges.reduce(
      (r, v, i, a, k = get(v, "node.id", "")) => {
        r[k] = true
        return r
      },
      {},
    )

    this.state = {
      ...labelOptions,
      ...labelableLabels,
    }
  }

  render() {
    const labelEdges = get(this.props, "study.labels.edges", [])
    return (
      <div className="StudyLabelChecklist">
        <ul>
          {labelEdges.map(edge =>
            <Edge key={get(edge, "node.id", "")} edge={edge} render={({node}) =>
              <li>
                <input
                  id={node.id}
                  type="checkbox"
                  name={node.id}
                  checked={this.state[node.id]}
                  onChange={this.handleChange}
                />
                <label htmlFor={node.id}>{node.name}</label>
              </li>
            } />)}
        </ul>
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
    this.setState({
      [e.target.name]: e.target.checked
    })
    this.props.onChange(e.target.name, e.target.checked)
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

export default createPaginationContainer(StudyLabelChecklist,
  {
    study: graphql`
      fragment StudyLabelChecklist_study on Study {
        labels(
          first: $count,
          after: $after,
        ) @connection(key: "StudyLabelChecklist_labels") {
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
      query StudyLabelChecklistForwardQuery(
        $owner: String!,
        $name: String!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          ...StudyLabelChecklist_study
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
