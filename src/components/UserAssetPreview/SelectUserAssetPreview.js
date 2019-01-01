import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { get } from 'utils'

class SelectUserAssetPreview extends React.Component {
  handleClick = (e) => {
    const {asset} = this.props
    this.props.onClick(asset)
  }

  get classes() {
    const {className, selected} = this.props

    return cls("UserAssetPreview mdc-image-list__item rn-image-list__item", className, {
      "rn-image-list__item--selected": selected,
    })
  }

  render() {
    const asset = get(this.props, "asset", {})

    return (
      <li className={this.classes} onClick={this.handleClick}>
        <div
          className="mdc-image-list__image-aspect-container pointer"
        >
          <img
            className="mdc-image-list__image"
            src={asset.href + "?s=400"}
            alt={asset.name}
          />
        </div>
        <div className="mdc-image-list__supporting">
          <div className="mdc-image-list__label" title={asset.name}>
            {asset.name}
          </div>
        </div>
      </li>
    )
  }
}

SelectUserAssetPreview.propTypes = {
  asset: PropTypes.shape({
    href: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool,
}

SelectUserAssetPreview.defaultProps = {
  asset: {
    href: "",
    name: "",
  },
  onClick: () => {},
  selected: false,
}

export default createFragmentContainer(SelectUserAssetPreview, graphql`
  fragment SelectUserAssetPreview_asset on UserAsset {
    href
    id
    name
  }
`)
