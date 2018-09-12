import * as React from 'react'
import cls from 'classnames'
import {SearchResultsProp, SearchResultsPropDefaults} from 'components/Search'
import CreateCourseLink from 'components/CreateCourseLink'
import CoursePreview from 'components/CoursePreview'
import {isEmpty} from 'utils'

class StudyCourses extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudyCourses mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const {search, study} = this.props
    const {edges, hasMore, isLoading, loadMore} = search

    return (
      <div className={this.classes}>
        {isLoading
        ? <div>Loading...</div>
        : (isEmpty(edges)
          ? <React.Fragment>
              <span className="mr1">
                No courses were found.
              </span>
              <CreateCourseLink className="rn-link" study={study}>
                Create a course.
              </CreateCourseLink>
            </React.Fragment>
          : <div className="mdc-layout-grid__inner">
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
              <button
                className="mdc-button mdc-button--unelevated"
                onClick={loadMore}
              >
                More
              </button>}
            </div>)}
      </div>
    )
  }
}

StudyCourses.propTypes = {
  search: SearchResultsProp,
}

StudyCourses.defaultProps = {
  search: SearchResultsPropDefaults,
}

export default StudyCourses
