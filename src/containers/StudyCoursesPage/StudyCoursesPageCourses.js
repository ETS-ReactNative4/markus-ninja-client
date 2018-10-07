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
          : <React.Fragment>
              {edges.map(({node}) => (
                node &&
                <React.Fragment key={node.id}>
                  <CoursePreview.Study
                    className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
                    course={node}
                  />
                  <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                </React.Fragment>
              ))}
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
            </React.Fragment>)}
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
