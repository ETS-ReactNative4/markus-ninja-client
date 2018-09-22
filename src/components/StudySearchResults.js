import * as React from 'react'
import {SearchProp, SearchPropDefaults} from 'components/Search'
import StudyPreview from 'components/StudyPreview'
import {isEmpty} from 'utils'

class StudySearchResults extends React.Component {
  render() {
    const {edges, hasMore, isLoading, loadMore} = this.props.search

    return (
      <React.Fragment>
        {isLoading
        ? <div>Loading...</div>
        : (isEmpty(edges)
          ? <span className="mr1">
              No studies were found.
            </span>
          : <React.Fragment>
              {edges.map(({node}) => (
                node &&
                <React.Fragment key={node.id}>
                  <StudyPreview.Search
                    className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
                    study={node}
                  />
                  <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                </React.Fragment>
              ))}
              {hasMore &&
              <button
                className="mdc-button mdc-button--unelevated"
                onClick={loadMore}
              >
                More
              </button>}
          </React.Fragment>)}
      </React.Fragment>
    )
  }
}

StudySearchResults.propTypes = {
  search: SearchProp,
}

StudySearchResults.defaultProps = {
  search: SearchPropDefaults,
}

export default StudySearchResults
