import * as React from 'react'
import {SearchProp, SearchPropDefaults} from 'components/Search'
import LabelPreview from 'components/LabelPreview'
import Counter from 'components/Counter'
import {get, isEmpty} from 'utils'

class LabelSearchResults extends React.Component {
  render() {
    const {search} = this.props
    const {edges, hasMore, isLoading, loadMore} = search
    const labelCount = get(search, "counts.label", 0)

    const noResults = isEmpty(edges)

    return (
      <React.Fragment>
        <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          Labels
          <Counter className="ml1">{labelCount}</Counter>
        </h5>
        {isLoading && noResults
        ? <div>Loading...</div>
        : (noResults
          ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              No labels were found.
            </div>
          : <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <ul className="mdc-list mdc-list--two-line">
                {edges.map(({node}) => (
                  node &&
                  <LabelPreview.List key={node.id} label={node} />
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

LabelSearchResults.propTypes = {
  search: SearchProp,
}

LabelSearchResults.defaultProps = {
  search: SearchPropDefaults,
}


export default LabelSearchResults
