import * as React from 'react'
import {SearchProp, SearchPropDefaults} from 'components/Search'
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
                <div key={node.id} className="mdc-layout-grid__cell">
                  <div className="flex flex-column h-100">
                    <UserPreview.Search className="flex-auto" user={node} />
                    <div className="rn-divider mt4" />
                  </div>
                </div>
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

UserSearchResults.propTypes = {
  search: SearchProp,
}

UserSearchResults.defaultProps = {
  search: SearchPropDefaults,
}

export default UserSearchResults
