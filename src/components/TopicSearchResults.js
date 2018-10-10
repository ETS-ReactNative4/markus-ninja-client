import * as React from 'react'
import {withRouter} from 'react-router-dom'
import {SearchProp, SearchPropDefaults} from 'components/Search'
import TopicPreview from 'components/TopicPreview'
import {isEmpty} from 'utils'

class TopicSearchResults extends React.Component {
  render() {
    const {search} = this.props
    const {edges, hasMore, isLoading, loadMore} = search

    const noResults = isEmpty(edges)

    return (
      <React.Fragment>
        {isLoading && noResults
        ? <div>Loading</div>
        : noResults
          ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              No topics were found.
            </div>
          : <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <ul className="mdc-list mdc-list--two-line">
                {edges.map(({node}) => (
                  node &&
                  <TopicPreview.Search key={node.id} topic={node} />
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
          </div>}
      </React.Fragment>
    )
  }
}

TopicSearchResults.propTypes = {
  search: SearchProp,
}

TopicSearchResults.defaultProps = {
  search: SearchPropDefaults,
}

export default withRouter(TopicSearchResults)
