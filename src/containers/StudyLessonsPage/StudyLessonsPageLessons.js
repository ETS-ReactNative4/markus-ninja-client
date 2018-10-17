import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {Link} from 'react-router-dom'
import {StudyLessonsProp, StudyLessonsPropDefaults} from 'components/StudyLessons'
import LessonPreview from 'components/LessonPreview'
import {isEmpty} from 'utils'

class StudyLessonsPageLessons extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const {lessons, study} = this.props
    const {edges, hasMore, isLoading, loadMore} = lessons

    const noResults = isEmpty(edges)

    return (
      <div className={this.classes}>
        <div className="mdc-card mdc-card--outlined ph2">
          {isLoading && noResults
          ? <div>Loading...</div>
          : (noResults
            ? <div>No lessons were found.</div>
            : this.renderLessons())}
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
                to={study.resourcePath+"/lessons/new"}
                aria-label="New lesson"
                title="New lesson"
              >
                add
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderLessons() {
    const edges = this.props.lessons.edges

    return (
      <ul className="mdc-list mdc-list--two-line">
        {edges.map(({node}) => (
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
  }).isRequired,
}

StudyLessonsPageLessons.defaultProps = {
  lessons: StudyLessonsPropDefaults,
  study: {
    resourcePath: "",
  }
}

export default StudyLessonsPageLessons
