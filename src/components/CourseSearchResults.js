import * as React from 'react'
import {SearchProp, SearchPropDefaults} from 'components/Search'
import CoursePreview from 'components/CoursePreview'
import {isEmpty} from 'utils'

class CourseSearchResults extends React.Component {
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
              No courses were found.
            </div>
          : <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <ul className="mdc-list mdc-list--two-line">
                {edges.map(({node}) => (
                  node &&
                  <CoursePreview.List key={node.id} course={node} />
                ))}
              </ul>
              {hasMore &&
              <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                <button
                  className="mdc-button mdc-button--unelevated"
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

CourseSearchResults.propTypes = {
  search: SearchProp,
}

CourseSearchResults.defaultProps = {
  search: SearchPropDefaults,
}

export default CourseSearchResults
