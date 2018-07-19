import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'

class UserAssetPreview extends Component {
  render() {
    const asset = get(this.props, "asset", {})
    return (
      <div>
        <a href={asset.url}>
          <span>{asset.name}</span>
          <span>{asset.type}</span>
        </a>
      </div>
    )
  }
}

export default createFragmentContainer(UserAssetPreview, graphql`
  fragment UserAssetPreview_asset on UserAsset {
    name
    type
  }
`)
