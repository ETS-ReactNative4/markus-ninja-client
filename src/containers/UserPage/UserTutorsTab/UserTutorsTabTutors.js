import * as React from 'react'
import cls from 'classnames'
import {UserEnrolledProp, UserEnrolledPropDefaults} from 'components/UserEnrolled'
import UserPreview from 'components/UserPreview'
import {isEmpty} from 'utils'

class UserTutorsTabTutors extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const {enrolled} = this.props
    const {edges, hasMore, isLoading, loadMore} = enrolled

    const noResults = isEmpty(edges)

    return (
      <div className={this.classes}>
        <div className="mdc-card mdc-card--outlined ph2">
          {isLoading && noResults
          ? <div>Loading...</div>
          : (noResults
            ? <div>No tutors were found.</div>
            : this.renderTutors())}
          <div className="mdc-card__actions">
            <div className="mdc-card__action-buttons">
              {hasMore &&
              <button
                className="mdc-button mdc-button--unelevated mdc-card__action mdc-card__action--button"
                type="button"
                onClick={loadMore}
              >
                More
              </button>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderTutors() {
    const edges = this.props.enrolled.edges

    return (
      <ul className="mdc-list mdc-list--two-line">
        {edges.map(({node}) => (
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
