import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class UserAssetPreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("UserAssetPreview mdc-image-list__item", className)
  }

  render() {
    const asset = get(this.props, "asset", {})
    return (
      <li className={this.classes}>
        <div className="mdc-image-list__image-aspect-container">
          <img
            className="mdc-image-list__image"
            src={asset.href}
            alt={asset.name}
          />
        </div>
        <Link className="mdc-image-list__supporting" to={asset.resourcePath}>
          <div className="mdc-image-list__label">
            {asset.name}
          </div>
        </Link>
      </li>
    )
  }
}

export default createFragmentContainer(UserAssetPreview, graphql`
  fragment UserAssetPreview_asset on UserAsset {
    href
    name
    resourcePath
  }
`)
