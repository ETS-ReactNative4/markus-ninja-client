import * as React from 'react'
import {UserEnrolleesProp, UserEnrolleesPropDefaults} from 'components/UserEnrollees'
import UserPreview from 'components/UserPreview'
import {isEmpty} from 'utils'

class UserPupilsTabPupils extends React.Component {
  render() {
    const {enrollees} = this.props
    const {edges, hasMore, isLoading, loadMore} = enrollees

    const noResults = isEmpty(edges)

    return (
      <React.Fragment>
        {isLoading && noResults
        ? <div>Loading...</div>
        : (noResults
          ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              No pupils were found.
            </div>
          : <React.Fragment>
              {edges.map(({node}) => (
                node &&
                <div key={node.id} className="mdc-layout-grid__cell">
                  <UserPreview.Tutor user={node} />
                  <div className="rn-divider mt4" />
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
            </React.Fragment>)}
      </React.Fragment>
    )
  }
}

UserPupilsTabPupils.propTypes = {
  enrollees: UserEnrolleesProp,
}

UserPupilsTabPupils.defaultProps = {
  enrollees: UserEnrolleesPropDefaults,
}

export default UserPupilsTabPupils
