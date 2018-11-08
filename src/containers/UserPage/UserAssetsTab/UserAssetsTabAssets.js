import * as React from 'react'
import cls from 'classnames'
import {UserAssetsProp, UserAssetsPropDefaults} from 'components/UserAssets'
import UserAssetPreview from 'components/UserAssetPreview'
import {isEmpty} from 'utils'

class UserAssetsPageAssets extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const {assets} = this.props
    const {hasMore, loadMore} = assets

    return (
      <div className={this.classes}>
        <div className="mdc-card mdc-card--outlined ph2">
          {this.renderAssets()}
          {hasMore &&
          <div className="mdc-card__actions">
            <div className="mdc-card__action-buttons">
              <button
                className="mdc-button mdc-button--unelevated mdc-card__action mdc-card__action--button"
                type="button"
                onClick={loadMore}
              >
                More
              </button>
            </div>
          </div>}
        </div>
      </div>
    )
  }

  renderAssets() {
    const {assets} = this.props
    const {dataIsStale,  edges, isLoading} = assets
    const noResults = isEmpty(edges)

    if (isLoading || noResults) {
      return (
        <ul className="mdc-list mdc-list--two-line">
          {isLoading && (dataIsStale || noResults)
          ? <li className="mdc-list-item">Loading...</li>
          : noResults &&
            <li className="mdc-list-item">No assets were found</li>}
        </ul>
      )
    }

    return (
      <div className="w-100 pv2">
        <ul className="rn-image-list mdc-image-list mdc-image-list--with-text-protection">
          {edges.map(({node}) => (
            node && <UserAssetPreview key={node.id} asset={node} />
          ))}
        </ul>
      </div>
    )
  }
}

UserAssetsPageAssets.propTypes = {
  assets: UserAssetsProp,
}

UserAssetsPageAssets.defaultProps = {
  assets: UserAssetsPropDefaults,
}

export default UserAssetsPageAssets
