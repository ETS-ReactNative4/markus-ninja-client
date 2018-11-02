import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {Link} from 'react-router-dom'
import {StudyCoursesProp, StudyCoursesPropDefaults} from 'components/StudyCourses'
import CoursePreview from 'components/CoursePreview'
import {isEmpty} from 'utils'

class StudyCoursesPageCourses extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const {courses, study} = this.props
    const {hasMore, loadMore} = courses

    return (
      <div className={this.classes}>
        <div className="mdc-card mdc-card--outlined ph2">
          {this.renderCourses()}
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
                to={study.resourcePath+"/courses/new"}
                aria-label="New course"
                title="New course"
              >
                add
              </Link>}
            </div>
          </div>}
        </div>
      </div>
    )
  }

  renderCourses() {
    const {courses} = this.props
    const {edges, isLoading} = courses
    const noResults = isEmpty(edges)

    return (
      <ul className="mdc-list mdc-list--two-line">
        {isLoading
        ? <li className="mdc-list-item">Loading...</li>
        : noResults
          ? <li className="mdc-list-item">No courses were found</li>
        : edges.map(({node}) => (
            node && <CoursePreview.List key={node.id} course={node} />
          ))}
      </ul>
    )
  }
}

StudyCoursesPageCourses.propTypes = {
  courses: StudyCoursesProp,
  study: PropTypes.shape({
    resourcePath: PropTypes.string.isRequired,
    viewerCanAdmin: PropTypes.bool.isRequired,
  }).isRequired,
}

StudyCoursesPageCourses.defaultProps = {
  courses: StudyCoursesPropDefaults,
  study: {
    resourcePath: "",
    viewerCanAdmin: false,
  }
}

export default StudyCoursesPageCourses
