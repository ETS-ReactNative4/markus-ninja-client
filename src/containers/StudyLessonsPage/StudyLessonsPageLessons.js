import * as React from 'react'
import PropTypes from 'prop-types'
import {StudyLessonsProp, StudyLessonsPropDefaults} from 'components/StudyLessons'
import LessonPreview from 'components/LessonPreview'
import Context from 'containers/StudyPage/Context'
import {isEmpty} from 'utils'


class StudyLessonsPageLessons extends React.Component {
  render() {
    const {toggleCreateLessonDialog} = this.context
    const {lessons, study} = this.props
    const {hasMore, loadMore} = lessons

    return (
      <div className="mdc-card mdc-card--outlined ph2">
        {this.renderLessons()}
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
            <button
              type="button"
              className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
              onClick={toggleCreateLessonDialog}
              aria-label="New lesson"
              title="New lesson"
            >
              add
            </button>}
          </div>
        </div>}
      </div>
    )
  }

  renderLessons() {
    const {lessons} = this.props
    const {dataIsStale, edges, isLoading} = lessons
    const noResults = isEmpty(edges)

    return (
      <ul className="mdc-list mdc-list--two-line">
        {isLoading && (dataIsStale || noResults)
        ? <li className="mdc-list-item">Loading...</li>
        : noResults
          ? <li className="mdc-list-item">No lessons were found</li>
        : edges.map(({node}) => (
            node && <LessonPreview.List key={node.id} lesson={node} />
          ))}
      </ul>
    )
  }
}

StudyLessonsPageLessons.propTypes = {
  lessons: StudyLessonsProp,
  study: PropTypes.shape({
    viewerCanAdmin: PropTypes.bool.isRequired,
  }).isRequired,
}

StudyLessonsPageLessons.defaultProps = {
  lessons: StudyLessonsPropDefaults,
  study: {
    viewerCanAdmin: false,
  }
}

StudyLessonsPageLessons.contextType = Context

export default StudyLessonsPageLessons
