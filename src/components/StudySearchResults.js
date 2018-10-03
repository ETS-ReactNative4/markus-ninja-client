import * as React from 'react'
import {SearchProp, SearchPropDefaults} from 'components/Search'
import StudyPreview from 'components/StudyPreview'
import {isEmpty} from 'utils'

class StudySearchResults extends React.Component {
  render() {
    const {edges, hasMore, isLoading, loadMore} = this.props.search

    const noResults = isEmpty(edges)

    return (
      <React.Fragment>
        {isLoading && noResults
        ? <div>Loading...</div>
        : (noResults
          ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              No studies were found.
            </div>
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
              <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                <button
                  className="mdc-button mdc-button--unelevated"
                  onClick={loadMore}
                >
                  More
                </button>
              </div>}
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
