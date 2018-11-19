import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {withRouter} from 'react-router-dom'
import { get } from 'utils'

class UserAssetPreview extends React.Component {
  handleClickImage = (e) => {
    const {asset} = this.props
    this.props.history.push(asset.resourcePath)
  }

  get classes() {
    const {className} = this.props
    return cls("UserAssetPreview mdc-image-list__item", className)
  }

  render() {
    const asset = get(this.props, "asset", {})
    return (
      <li className={this.classes}>
        <div
          className="mdc-image-list__image-aspect-container pointer"
          onClick={this.handleClickImage}
        >
          <img
            className="mdc-image-list__image"
            src={asset.href + "?s=400"}
            alt={asset.name}
          />
        </div>
        <div className="mdc-image-list__supporting">
          <div className="mdc-image-list__label">
            {asset.name}
          </div>
        </div>
      </li>
    )
  }
}

UserAssetPreview.propTypes = {
  asset: PropTypes.shape({
    href: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    resourcePath: PropTypes.string.isRequired,
  })
}

UserAssetPreview.defaultProps = {
  asset: {
    href: "",
    name: "",
    resourcePath: "",
  }
}

export default withRouter(createFragmentContainer(UserAssetPreview, graphql`
  fragment UserAssetPreview_asset on UserAsset {
    href
    name
    resourcePath
  }
`))
