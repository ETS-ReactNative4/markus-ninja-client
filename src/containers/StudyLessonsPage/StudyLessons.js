import * as React from 'react'
import cls from 'classnames'
import {SearchResultsProp, SearchResultsPropDefaults} from 'components/Search'
import CreateLessonLink from 'components/CreateLessonLink'
import LessonPreview from 'components/LessonPreview'
import {isEmpty} from 'utils'

class StudyLessons extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudyLessons mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
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
                No lessons were found.
              </span>
              <CreateLessonLink className="rn-link" study={study}>
                Create a lesson.
              </CreateLessonLink>
            </React.Fragment>
          : <div className="mdc-layout-grid__inner">
              {edges.map(({node}) => (
                node &&
                <React.Fragment key={node.id}>
                  <LessonPreview.Study
                    className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
                    lesson={node}
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

StudyLessons.propTypes = {
  search: SearchResultsProp,
}

StudyLessons.defaultProps = {
  search: SearchResultsPropDefaults,
}

export default StudyLessons
