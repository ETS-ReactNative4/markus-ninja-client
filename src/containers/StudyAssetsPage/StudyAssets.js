import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import UserAssetPreview from 'components/UserAssetPreview'
import {isEmpty} from 'utils'

class StudyAssets extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudyAssets", className)
  }

  render() {
    const {search} = this.props
    const {edges, hasMore, loadMore} = search

    return (
      <div className={this.classes}>
        {isEmpty(edges)
        ? <React.Fragment>
          <span className="mr1">
            No assets were found.
          </span>
        </React.Fragment>
      : <div className="StudyAssets__assets">
          {edges.map(({node}) => (
            node && <UserAssetPreview key={node.id} asset={node} />
          ))}
          {hasMore &&
          <button
            className="mdc-button mdc-button--unelevated"
            onClick={loadMore}
          >
            More
          </button>}
        </div>
      }
      </div>
    )
  }
}

StudyAssets.propTypes = {
  search: PropTypes.shape({
    edges: PropTypes.array,
    hasMore: PropTypes.bool,
    loadMore: PropTypes.func,
    totalCount: PropTypes.number,
  })
}

StudyAssets.defaultProps = {
  search: {
    edges: [],
    hasMore: false,
    loadMore: () => {},
    totalCount: 0,
  }
}

export default StudyAssets
