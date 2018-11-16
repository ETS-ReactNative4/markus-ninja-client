import * as React from 'react'
import {UserEnrolledProp, UserEnrolledPropDefaults} from 'components/UserEnrolled'
import UserPreview from 'components/UserPreview'
import {isEmpty} from 'utils'

class UserTutorsTabTutors extends React.Component {
  render() {
    const {enrolled} = this.props
    const {hasMore, loadMore} = enrolled

    return (
      <div className="mdc-card mdc-card--outlined ph2">
        {this.renderTutors()}
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
    )
  }

  renderTutors() {
    const {enrolled} = this.props
    const {edges, isLoading} = enrolled
    const noResults = isEmpty(edges)

    return (
      <ul className="mdc-list mdc-list--two-line">
        {isLoading
        ? <li className="mdc-list-item">Loading...</li>
        : noResults
          ? <li className="mdc-list-item">No tutors were found</li>
        : edges.map(({node}) => (
            node &&
            <UserPreview.List key={node.id} user={node} />
          ))}
      </ul>
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
