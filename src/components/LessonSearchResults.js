import * as React from 'react'
import {SearchProp, SearchPropDefaults} from 'components/Search'
import LessonPreview from 'components/LessonPreview'
import {isEmpty} from 'utils'

class LessonSearchResults extends React.Component {
  render() {
    const {search} = this.props
    const {edges, hasMore, isLoading, loadMore} = search

    const noResults = isEmpty(edges)

    return (
      <React.Fragment>
        {isLoading && noResults
        ? <div>Loading...</div>
        : (noResults
          ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              No lessons were found.
            </div>
          : <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <ul className="mdc-list mdc-list--two-line">
                {edges.map(({node}) => (
                  node &&
                  <LessonPreview.List key={node.id} lesson={node} />
                ))}
              </ul>
              {hasMore &&
              <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                <button
                  className="mdc-button mdc-button--unelevated"
                  type="button"
                  onClick={loadMore}
                >
                  More
                </button>
              </div>}
            </div>)}
      </React.Fragment>
    )
  }
}

LessonSearchResults.propTypes = {
  search: SearchProp,
}

LessonSearchResults.defaultProps = {
  search: SearchPropDefaults,
}

export default LessonSearchResults
