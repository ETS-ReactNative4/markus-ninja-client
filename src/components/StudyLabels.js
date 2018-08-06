import React, { Component } from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import pluralize from 'pluralize'
import Label from 'components/Label'
import Counter from 'components/Counter'
import { get } from 'utils'

import { LESSONS_PER_PAGE } from 'consts'

class StudyLabels extends Component {
  render() {
    const study = get(this.props, "study", null)
    const labelEdges = get(study, "labels.edges", [])
    const labelCount = get(study, "labels.totalCount", 0)
    return (
      <div className="StudyLabels">
        <h3>
          <Counter>{labelCount}</Counter>
          {pluralize("Labels", labelCount)}
        </h3>
        <div className="StudyLabels__labels">
          {labelEdges.map(({node}) => (
            <Label key={node.__id} label={node} />
          ))}
          {this.props.relay.hasMore() &&
          <button
            className="StudyLabels__more"
            onClick={this._loadMore}
          >
            More
          </button>}
        </div>
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

export default createPaginationContainer(StudyLabels,
  {
    study: graphql`
      fragment StudyLabels_study on Study {
        labels(
          first: $count,
          after: $after,
        ) @connection(key: "StudyLabels_labels") {
          edges {
            node {
              ...Label_label
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
  {
    direction: 'forward',
    query: graphql`
      query StudyLabelsForwardQuery(
        $owner: String!,
        $name: String!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          ...StudyLabels_study
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
      }
    },
  },
)
