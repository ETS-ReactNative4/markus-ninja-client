import * as React from 'react'
import {StudyCoursesProp, StudyCoursesPropDefaults} from 'components/StudyCourses'
import CoursePreview from 'components/CoursePreview'
import {isEmpty} from 'utils'

class StudyCoursesPageCourses extends React.Component {
  render() {
    const {courses} = this.props
    const {edges, hasMore, isLoading, loadMore} = courses

    const noResults = isEmpty(edges)

    return (
      <React.Fragment>
        {isLoading && noResults
        ? <div>Loading...</div>
        : (noResults
          ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              No courses were found.
            </div>
          : <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <div className="mdc-list mdc-list--two-line">
                {edges.map(({node}) => (
                  node && <CoursePreview.List key={node.id} course={node} />
                ))}
              </div>
              {hasMore &&
              <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                <button
                  className="mdc-button mdc-button--unelevated"
                  type="button"
                  onClick={loadMore}
                >
                  More
                </button>
              </div>}
            </div>)}
      </React.Fragment>
    )
  }
}

StudyCoursesPageCourses.propTypes = {
  courses: StudyCoursesProp,
}

StudyCoursesPageCourses.defaultProps = {
  courses: StudyCoursesPropDefaults,
}

export default StudyCoursesPageCourses
