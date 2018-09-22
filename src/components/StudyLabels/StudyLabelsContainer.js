import * as React from 'react'
import PropTypes from 'prop-types'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import {withRouter} from 'react-router-dom'
import { get } from 'utils'

import { LABELS_PER_PAGE } from 'consts'

class StudyLabelsContainer extends React.Component {
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

  render() {
    const child = React.Children.only(this.props.children)
    const {relay} = this.props

    return React.cloneElement(child, {
      studyLabels: {
        edges: get(this.props, "study.labels.edges", []),
        hasMore: relay.hasMore(),
        isLoading: relay.isLoading(),
        loadMore: this._loadMore
      }
    })
  }
}

export const StudyLabelsProp = PropTypes.shape({
  edges: PropTypes.array,
  idLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
})

export const StudyLabelsPropDefaults = {
  edges: [],
  isLoading: false,
  hasMore: false,
  loadMore: () => {},
}

export default withRouter(createPaginationContainer(StudyLabelsContainer,
  {
    study: graphql`
      fragment StudyLabelsContainer_study on Study @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String!"},
      ) {
        labels(
          first: $count,
          after: $after,
        ) @connection(key: "StudyLabelsContainer_labels") {
          edges {
            node {
              id
              ...Label_label
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
      query StudyLabelsContainerForwardQuery(
        $owner: String!,
        $name: String!,
        $count: Int!,
        $after: String,
      ) {
        study(owner: $owner, name: $name) {
          ...StudyLabelsContainer_study @arguments(
            count: $count,
            after: $after,
          )
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
))
