import * as React from 'react'
import {SearchResultsProp, SearchResultsPropDefaults} from 'components/Search'
import LessonPreview from 'components/LessonPreview'
import {isEmpty} from 'utils'

class LessonSearchResults extends React.Component {
  render() {
    const {search} = this.props
    const {edges, hasMore, isLoading, loadMore} = search

    return (
      <React.Fragment>
        {isLoading
        ? <div>Loading...</div>
        : (isEmpty(edges)
          ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              No lessons were found.
            </div>
          : <React.Fragment>
              {edges.map(({node}) => (
                node &&
                <React.Fragment key={node.id}>
                  <LessonPreview.Study
                    className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
                    lesson={node}
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

LessonSearchResults.propTypes = {
  search: SearchResultsProp,
}

LessonSearchResults.defaultProps = {
  search: SearchResultsPropDefaults,
}

export default LessonSearchResults
