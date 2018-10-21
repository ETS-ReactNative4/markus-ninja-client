import * as React from 'react'
import cls from 'classnames'
import {UserEnrolleesProp, UserEnrolleesPropDefaults} from 'components/UserEnrollees'
import UserPreview from 'components/UserPreview'
import {isEmpty} from 'utils'

class UserPupilsTabPupils extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const {enrollees} = this.props
    const {hasMore, loadMore} = enrollees

    return (
      <div className={this.classes}>
        <div className="mdc-card mdc-card--outlined ph2">
          {this.renderPupils()}
          {hasMore &&
          <div className="mdc-card__actions">
            <div className="mdc-card__action-buttons">
              <button
                className="mdc-button mdc-button--unelevated mdc-card__action mdc-card__action--button"
                type="button"
                onClick={loadMore}
              >
                More
              </button>
            </div>
          </div>}
        </div>
      </div>
    )
  }

  renderPupils() {
    const {enrollees} = this.props
    const {edges, isLoading} = enrollees
    const noResults = isEmpty(edges)

    return (
      <ul className="mdc-list mdc-list--two-line">
        {isLoading
        ? <li className="mdc-list-item">Loading...</li>
        : noResults
          ? <li className="mdc-list-item">No pupils were found</li>
        : edges.map(({node}) => (
            node &&
            <UserPreview.List key={node.id} user={node} />
          ))}
      </ul>
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
