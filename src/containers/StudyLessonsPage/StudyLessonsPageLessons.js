import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {StudyLessonsProp, StudyLessonsPropDefaults} from 'components/StudyLessons'
import LessonPreview from 'components/LessonPreview'
import {isEmpty} from 'utils'

import Context from 'containers/StudyPage/Context'

class StudyLessonsPageLessons extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const {toggleCreateLessonDialog} = this.context
    const {lessons, study} = this.props
    const {hasMore, loadMore} = lessons

    return (
      <div className={this.classes}>
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
      </div>
    )
  }

  renderLessons() {
    const {lessons} = this.props
    const {edges, isLoading} = lessons
    const noResults = isEmpty(edges)

    return (
      <ul className="mdc-list mdc-list--two-line">
        {isLoading
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
    resourcePath: PropTypes.string.isRequired,
    viewerCanAdmin: PropTypes.bool.isRequired,
  }).isRequired,
}

StudyLessonsPageLessons.defaultProps = {
  lessons: StudyLessonsPropDefaults,
  study: {
    resourcePath: "",
    viewerCanAdmin: false,
  }
}

StudyLessonsPageLessons.contextType = Context

export default StudyLessonsPageLessons
