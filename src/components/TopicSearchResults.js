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
        : <React.Fragment>
            {edges.map(({node}) => (
              node &&
              <div key={node.id} className="mdc-layout-grid__cell">
                <div className="mdc-card mdc-card--outlined">
                  <TopicPreview.Search
                    className="mdc-card__primary-action pa3 h-100"
                    topic={node}
                  />
                </div>
              </div>
            ))}
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
          </React.Fragment>}
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
