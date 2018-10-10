import * as React from 'react'
import {SearchProp, SearchPropDefaults} from 'components/Search'
import UserPreview from 'components/UserPreview'
import {isEmpty} from 'utils'

class UserSearchResults extends React.Component {
  render() {
    const {edges, hasMore, isLoading, loadMore} = this.props.search

    const noResults = isEmpty(edges)

    return (
      <React.Fragment>
        {isLoading && noResults
        ? <div>Loading...</div>
        : (noResults
          ? <span className="mr1">
              No users were found.
            </span>
          : <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <ul className="mdc-list mdc-list--two-line">
                {edges.map(({node}) => (
                  node &&
                  <UserPreview.Search key={node.id} user={node} />
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

UserSearchResults.propTypes = {
  search: SearchProp,
}

UserSearchResults.defaultProps = {
  search: SearchPropDefaults,
}

export default UserSearchResults
