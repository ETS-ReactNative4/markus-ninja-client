import * as React from 'react'
import PropTypes from 'prop-types'
import {
  createPaginationContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {withRouter} from 'react-router-dom';
import {StudyLabelsProp, StudyLabelsPropDefaults} from 'components/StudyLabels'
import LabelPreview from 'components/LabelPreview'
import LabelSet from 'components/LabelSet'
import {get, isEmpty} from 'utils'
import { LABELS_PER_PAGE } from 'consts'

class UserAssetLabels extends React.Component {
  _loadMore = () => {
    const {loadMore} = this.props.labels
    loadMore(LABELS_PER_PAGE)

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

  handleLabelChecked_ = (checked) => {
    this.props.onLabelToggled(checked)
  }

  get _hasMore() {
    const {hasMore} = this.props.labels
    return hasMore || this.props.relay.hasMore()
  }

  render() {
    let {edges: studyLabelEdges} = this.props.labels

    const assetId = get(this.props, "asset.id", "")
    const viewerCanUpdate = get(this.props, "asset.viewerCanUpdate", false)
    const assetLabelEdges = get(this.props, "asset.labels.edges", [])
    const selectedLabelIds = assetLabelEdges.map(({node}) => node.id)

    if (isEmpty(studyLabelEdges)) {
      return null
    } else if (!viewerCanUpdate) {
      studyLabelEdges = studyLabelEdges.reduce((r, v) => {
        if (selectedLabelIds.indexOf(get(v, "node.id")) > -1) {
          r.push(v)
        }
        return r
      }, [])
    }

    return (
      <div className="mv3">
        <LabelSet selectedLabelIds={selectedLabelIds}>
          {studyLabelEdges.map(({node}) =>
            node &&
            <LabelPreview.Toggle
              key={node.id}
              id={node.id}
              label={node}
              labelableId={assetId}
              disabled={!viewerCanUpdate}
              onLabelChecked={this.handleLabelChecked_}
            />)}
        </LabelSet>
        {this._hasMore &&
        <button
          className="mdc-button mdc-button--unelevated"
          type="button"
          onClick={this._loadMore}
        >
          More
        </button>}
      </div>
    )
  }
}

UserAssetLabels.propTypes = {
  labels: StudyLabelsProp,
  onLabelToggled: PropTypes.func,
}

UserAssetLabels.defaultProps = {
  labels: StudyLabelsPropDefaults,
  onLabelToggled: () => {},
}


export default withRouter(createPaginationContainer(UserAssetLabels,
  {
    asset: graphql`
      fragment UserAssetLabels_asset on UserAsset {
        id
        labels(
          first: $count,
          after: $after,
        ) @connection(key: "UserAssetLabels_labels", filters: []) {
          edges {
            node {
              id
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
        viewerCanUpdate
      }
    `,
  },
  {
    direction: 'forward',
    query: graphql`
      query UserAssetLabelsForwardQuery(
        $owner: String!,
        $name: String!,
        $filename: String!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          asset(name: $filename) {
            ...UserAssetLabels_asset
          }
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
        filename: props.match.params.filename,
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    }
  }
))
