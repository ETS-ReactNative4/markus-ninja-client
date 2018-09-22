import * as React from 'react'
import {SearchProp, SearchPropDefaults} from 'components/Search'
import CoursePreview from 'components/CoursePreview'
import {isEmpty} from 'utils'

class CourseSearchResults extends React.Component {
  render() {
    const {search} = this.props
    const {edges, hasMore, isLoading, loadMore} = search

    return (
      <React.Fragment>
        {isLoading
        ? <div>Loading...</div>
        : (isEmpty(edges)
          ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              No courses were found.
            </div>
          : <React.Fragment>
              {edges.map(({node}) => (
                node &&
                <React.Fragment key={node.id}>
                  <CoursePreview.Study
                    className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
                    course={node}
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

CourseSearchResults.propTypes = {
  search: SearchProp,
}

CourseSearchResults.defaultProps = {
  search: SearchPropDefaults,
}

export default CourseSearchResults
