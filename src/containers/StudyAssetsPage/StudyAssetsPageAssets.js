import * as React from 'react'
import {StudyAssetsProp, StudyAssetsPropDefaults} from 'components/StudyAssets'
import UserAssetPreview from 'components/UserAssetPreview'
import {isEmpty} from 'utils'

class StudyAssetsPageAssets extends React.Component {
  render() {
    const {assets} = this.props
    const {edges, hasMore, isLoading, loadMore} = assets

    const noResults = isEmpty(edges)

    return (
      <React.Fragment>
        {isLoading && noResults
        ? <div>Loading...</div>
        : (noResults
          ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              No assets were found.
            </div>
        : <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <ul className="rn-image-list mdc-image-list mdc-image-list--with-text-protection">
              {edges.map(({node}) => (
                node &&
                <UserAssetPreview key={node.id} asset={node} />))}
              {hasMore &&
              <button
                className="mdc-button mdc-button--unelevated"
                onClick={loadMore}
              >
                More
              </button>}
            </ul>
          </div>)}
      </React.Fragment>
    )
  }
}

StudyAssetsPageAssets.propTypes = {
  assets: StudyAssetsProp,
}

StudyAssetsPageAssets.defaultProps = {
  assets: StudyAssetsPropDefaults,
}

export default StudyAssetsPageAssets
