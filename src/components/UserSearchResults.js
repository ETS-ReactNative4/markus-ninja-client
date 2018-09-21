import * as React from 'react'
import {SearchResultsProp, SearchResultsPropDefaults} from 'components/Search'
import UserPreview from 'components/UserPreview'
import {isEmpty} from 'utils'

class UserSearchResults extends React.Component {
  render() {
    const {edges, hasMore, isLoading, loadMore} = this.props.search

    return (
      <React.Fragment>
        {isLoading
        ? <div>Loading...</div>
        : (isEmpty(edges)
          ? <span className="mr1">
              No users were found.
            </span>
          : <React.Fragment>
              {edges.map(({node}) => (
                node &&
                <React.Fragment key={node.id}>
                  <UserPreview.Search
                    className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
                    user={node}
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

UserSearchResults.propTypes = {
  search: SearchResultsProp,
}

UserSearchResults.defaultProps = {
  search: SearchResultsPropDefaults,
}

export default UserSearchResults
