import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {StudyAssetsProp, StudyAssetsPropDefaults} from 'components/StudyAssets'
import UserAssetPreview from 'components/UserAssetPreview'
import Context from 'containers/StudyPage/Context'
import {isEmpty} from 'utils'

class StudyAssetsPageAssets extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const {toggleCreateUserAssetDialog} = this.context
    const {assets, study} = this.props
    const {hasMore, loadMore} = assets

    return (
      <div className={this.classes}>
        <div className="mdc-card mdc-card--outlined ph2">
          {this.renderAssets()}
          {(hasMore || study.viewerCanAdmin) &&
          <div className="mdc-card__actions">
            <div className="mdc-card__action-buttons">
              {hasMore &&
              <button
                className="mdc-button mdc-button--unelevated mdc-card__action mdc-card__action--button"
                type="button"
                onClick={loadMore}
              >
                More
              </button>}
            </div>
            <div className="mdc-card__action-icons">
              {study.viewerCanAdmin &&
              <button
                type="button"
                className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
                onClick={toggleCreateUserAssetDialog}
                aria-label="New asset"
                title="New asset"
              >
                add
              </button>}
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

StudyAssetsPageAssets.propTypes = {
  assets: StudyAssetsProp,
  study: PropTypes.shape({
    viewerCanAdmin: PropTypes.bool.isRequired,
  }).isRequired,
}

StudyAssetsPageAssets.defaultProps = {
  assets: StudyAssetsPropDefaults,
  study: {
    viewerCanAdmin: false,
  }
}

StudyAssetsPageAssets.contextType = Context

export default StudyAssetsPageAssets
