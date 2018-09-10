import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import CreateCourseLink from 'components/CreateCourseLink'
import CoursePreview from 'components/CoursePreview'
import {isEmpty} from 'utils'

class StudyCourses extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudyCourses", className)
  }

  render() {
    const {search, study} = this.props
    const {edges, hasMore, loadMore} = search

    return (
      <div className={this.classes}>
        {isEmpty(edges)
        ? <React.Fragment>
          <span className="mr1">
            No courses were found.
          </span>
          <CreateCourseLink className="rn-link" study={study}>
            Create a course.
          </CreateCourseLink>
        </React.Fragment>
      : <div className="StudyCourses__courses">
          {edges.map(({node}) => (
            node && <CoursePreview key={node.id} course={node} />
          ))}
          {hasMore &&
          <button
            className="mdc-button mdc-button--unelevated"
            onClick={loadMore}
          >
            More
          </button>}
        </div>
      }
      </div>
    )
  }
}

StudyCourses.propTypes = {
  search: PropTypes.shape({
    edges: PropTypes.array,
    hasMore: PropTypes.bool,
    loadMore: PropTypes.func,
    totalCount: PropTypes.number,
  })
}

StudyCourses.defaultProps = {
  search: {
    edges: [],
    hasMore: false,
    loadMore: () => {},
    totalCount: 0,
  }
}

export default StudyCourses
