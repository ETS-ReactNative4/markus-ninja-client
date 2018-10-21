import * as React from 'react'
import cls from 'classnames'
import {Link} from 'react-router-dom'
import {UserStudiesProp, UserStudiesPropDefaults} from 'components/UserStudies'
import StudyPreview from 'components/StudyPreview'
import {isEmpty} from 'utils'

class UserStudiesTabStudies extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const {studies} = this.props
    const {hasMore, loadMore} = studies

    return (
      <div className={this.classes}>
        <div className="mdc-card mdc-card--outlined ph2">
          {this.renderStudies()}
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
            <div className="mdc-card__action-icons">
              <Link
                className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
                to="/new"
                aria-label="New study"
                title="New study"
              >
                add
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderStudies() {
    const {studies} = this.props
    const {edges, isLoading, isStale} = studies
    const noResults = isEmpty(edges)

    return (
      <ul className="mdc-list mdc-list--two-line">
        {isLoading && isStale
        ? <li className="mdc-list-item">Loading...</li>
        : noResults
          ? <li className="mdc-list-item">No studies were found</li>
        : edges.map(({node}) => (
            node &&
            <StudyPreview.List key={node.id} study={node} />
          ))}
      </ul>
    )
  }
}

UserStudiesTabStudies.propTypes = {
  studies: UserStudiesProp,
}

UserStudiesTabStudies.defaultProps = {
  studies: UserStudiesPropDefaults,
}

export default UserStudiesTabStudies
