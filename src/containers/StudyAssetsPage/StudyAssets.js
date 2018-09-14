import * as React from 'react'
import cls from 'classnames'
import {SearchResultsProp, SearchResultsPropDefaults} from 'components/Search'
import CreateUserAssetLink from 'components/CreateUserAssetLink'
import UserAssetPreview from 'components/UserAssetPreview'
import {isEmpty} from 'utils'

class StudyAssets extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudyAssets mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const {search, study} = this.props
    const {edges, hasMore, isLoading, loadMore} = search

    return (
      <div className={this.classes}>
        {isLoading
        ? <div>Loading...</div>
        : (isEmpty(edges)
          ? <React.Fragment>
              <span className="mr1">
                No assets were found.
              </span>
              <CreateUserAssetLink className="rn-link" study={study}>
                Create an asset.
              </CreateUserAssetLink>
            </React.Fragment>
        : <ul className="rn-image-list mdc-image-list mdc-image-list--with-text-protection">
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
          </ul>)}
      </div>
    )
  }
}

StudyAssets.propTypes = {
  search: SearchResultsProp,
}

StudyAssets.defaultProps = {
  search: SearchResultsPropDefaults,
}

export default StudyAssets
