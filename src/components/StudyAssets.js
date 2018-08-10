import React, { Component } from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import UserAssetPreview from './UserAssetPreview.js'
import { get } from 'utils'

import { ASSETS_PER_PAGE } from 'consts'

class StudyAssets extends Component {
  render() {
    const study = get(this.props, "study", null)
    const assetEdges = get(study, "assets.edges", [])
    return (
      <div className="StudyAssets">
        {assetEdges.length < 1
        ? (
            <div>
              There are no assets in this study.
            </div>
          )
        : (
            <div className="StudyAssets__assets">
              {assetEdges.map(({node}) => (
                <UserAssetPreview key={node.__id} asset={node} />
              ))}
              {this.props.relay.hasMore() &&
              <button
                className="StudyAssets__more"
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

    relay.loadMore(ASSETS_PER_PAGE)
  }
}

export default createPaginationContainer(StudyAssets,
  {
    study: graphql`
      fragment StudyAssets_study on Study {
        assets(
          first: $count,
          after: $after,
          orderBy:{direction: ASC field:NAME}
        ) @connection(key: "StudyAssets_assets", filters: []) {
          edges {
            node {
              ...UserAssetPreview_asset
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
      query StudyAssetsForwardQuery(
        $owner: String!,
        $name: String!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          ...StudyAssets_study
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "study.assets")
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
