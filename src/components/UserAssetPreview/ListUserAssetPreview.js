import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import getHistory from 'react-router-global-history'

class ListUserAssetPreview extends React.Component {
  handleClickImage = (e) => {
    const {asset} = this.props
    getHistory().push(asset.resourcePath)
  }

  get classes() {
    const {className, dragging, editing} = this.props
    return cls("ListUserAssetPreview mdc-image-list__item", className, {
      "ListUserAssetPreview--editing": editing,
      "ListUserAssetPreview--dragging": dragging,
    })
  }

  get otherProps() {
    const {
      children,
      className,
      dragging,
      editing,
      innerRef,
      isActivity,
      asset,
      ...otherProps
    } = this.props

    return otherProps
  }

  render() {
    const {asset, innerRef, isActivity} = this.props

    if (!asset) {
      return null
    }

    return (
      <li
        {...this.otherProps}
        ref={innerRef}
        className={this.classes}
      >
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
          <div className="mdc-image-list__label" title={asset.name}>
            {isActivity ? `#${asset.activityNumber} ` : ""}{asset.name}
          </div>
        </div>
      </li>
    )
  }
}

ListUserAssetPreview.propTypes = {
  asset: PropTypes.shape({
    href: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    resourcePath: PropTypes.string.isRequired,
  }),
  dragging: PropTypes.bool,
  editing: PropTypes.bool,
  isActivity: PropTypes.bool,
}

ListUserAssetPreview.defaultProps = {
  asset: {
    href: "",
    name: "",
    resourcePath: "",
  },
  dragging: false,
  editing: false,
  isActivity: false,
}

export default createFragmentContainer(ListUserAssetPreview, graphql`
  fragment ListUserAssetPreview_asset on UserAsset {
    activity {
      id
      viewerCanAdmin
    }
    activityNumber
    href
    name
    resourcePath
  }
`)
