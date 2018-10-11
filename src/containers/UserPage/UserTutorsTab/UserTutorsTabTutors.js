import * as React from 'react'
import {UserEnrolledProp, UserEnrolledPropDefaults} from 'components/UserEnrolled'
import UserPreview from 'components/UserPreview'
import {isEmpty} from 'utils'

class UserTutorsTabTutors extends React.Component {
  render() {
    const {enrolled} = this.props
    const {edges, hasMore, isLoading, loadMore} = enrolled

    const noResults = isEmpty(edges)

    return (
      <React.Fragment>
        {isLoading && noResults
        ? <div>Loading...</div>
        : (noResults
          ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              No tutors were found.
            </div>
          : <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <ul className="mdc-list mdc-list--two-line">
                {edges.map(({node}) => (
                  node &&
                  <UserPreview.List key={node.id} user={node} />
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

UserTutorsTabTutors.propTypes = {
  enrolled: UserEnrolledProp,
}

UserTutorsTabTutors.defaultProps = {
  enrolled: UserEnrolledPropDefaults,
}

export default UserTutorsTabTutors
