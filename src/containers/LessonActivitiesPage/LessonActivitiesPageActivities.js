import * as React from 'react'
import {LessonActivitiesProp, LessonActivitiesPropDefaults} from 'components/LessonActivities'
import ActivityPreview from 'components/ActivityPreview'
import {isEmpty} from 'utils'

class LessonActivitiesPageActivities extends React.Component {
  render() {
    const {activities} = this.props
    const {hasMore, loadMore} = activities

    return (
      <div className="mdc-card mdc-card--outlined ph2">
        {this.renderActivities()}
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

LessonActivitiesPageActivities.propTypes = {
  activities: LessonActivitiesProp,
}

LessonActivitiesPageActivities.defaultProps = {
  activities: LessonActivitiesPropDefaults,
}

export default LessonActivitiesPageActivities
