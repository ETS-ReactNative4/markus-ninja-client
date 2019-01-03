import * as React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {StudyActivitiesProp, StudyActivitiesPropDefaults} from 'components/StudyActivities'
import ActivityPreview from 'components/ActivityPreview'
import {isEmpty} from 'utils'

class StudyActivitiesPageActivities extends React.Component {
  render() {
    const {activities, study} = this.props
    const {hasMore, loadMore} = activities

    return (
      <div className="mdc-card mdc-card--outlined ph2">
        {this.renderActivities()}
        {(hasMore || study.viewerCanAdmin) &&
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
            {study.viewerCanAdmin &&
            <Link
              className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
              to={study.resourcePath+"/activities/new"}
              aria-label="New activity"
              title="New activity"
            >
              add
            </Link>}
          </div>
        </div>}
      </div>
    )
  }

  renderActivities() {
    const {activities} = this.props
    const {dataIsStale, edges, isLoading} = activities
    const noResults = isEmpty(edges)

    return (
      <ul className="mdc-list mdc-list--two-line">
        {isLoading && (dataIsStale || noResults)
        ? <li className="mdc-list-item">Loading...</li>
        : noResults
          ? <li className="mdc-list-item">No activities were found</li>
        : edges.map(({node}) => (
            node && <ActivityPreview.List key={node.id} activity={node} />
          ))}
      </ul>
    )
  }
}

StudyActivitiesPageActivities.propTypes = {
  activities: StudyActivitiesProp,
  study: PropTypes.shape({
    resourcePath: PropTypes.string.isRequired,
    viewerCanAdmin: PropTypes.bool.isRequired,
  }).isRequired,
}

StudyActivitiesPageActivities.defaultProps = {
  activities: StudyActivitiesPropDefaults,
  study: {
    resourcePath: "",
    viewerCanAdmin: false,
  }
}

export default StudyActivitiesPageActivities
