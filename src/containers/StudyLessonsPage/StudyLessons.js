import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import CreateLessonLink from 'components/CreateLessonLink'
import LessonPreview from 'components/LessonPreview'
import {isEmpty} from 'utils'

class StudyLessons extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudyLessons", className)
  }

  render() {
    const {search, study} = this.props
    const {edges, hasMore, loadMore} = search

    return (
      <div className={this.classes}>
        {isEmpty(edges)
        ? <React.Fragment>
          <span className="mr1">
            No lessons were found.
          </span>
          <CreateLessonLink className="rn-link" study={study}>
            Create a lesson.
          </CreateLessonLink>
        </React.Fragment>
      : <div className="StudyLessons__lessons">
          {edges.map(({node}) => (
            node && <LessonPreview key={node.id} lesson={node} />
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

StudyLessons.propTypes = {
  search: PropTypes.shape({
    edges: PropTypes.array,
    hasMore: PropTypes.bool,
    loadMore: PropTypes.func,
    totalCount: PropTypes.number,
  })
}

StudyLessons.defaultProps = {
  search: {
    edges: [],
    hasMore: false,
    loadMore: () => {},
    totalCount: 0,
  }
}

export default StudyLessons
