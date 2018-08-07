import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class UserAssetPreview extends Component {
  render() {
    const asset = get(this.props, "asset", {})
    return (
      <div>
        <Link to={asset.resourcePath}>
          <span>{asset.name}</span>
          <span>{asset.type}</span>
        </Link>
      </div>
    )
  }
}

export default createFragmentContainer(UserAssetPreview, graphql`
  fragment UserAssetPreview_asset on UserAsset {
    name
    resourcePath
    type
  }
`)
