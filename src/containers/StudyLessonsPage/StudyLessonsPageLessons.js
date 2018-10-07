import * as React from 'react'
import {StudyLessonsProp, StudyLessonsPropDefaults} from 'components/StudyLessons'
import LessonPreview from 'components/LessonPreview'
import {isEmpty} from 'utils'

class StudyLessonsPageLessons extends React.Component {
  render() {
    const {lessons} = this.props
    const {edges, hasMore, isLoading, loadMore} = lessons

    const noResults = isEmpty(edges)

    return (
      <React.Fragment>
        {isLoading && noResults
        ? <div>Loading...</div>
        : (noResults
          ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              No lessons were found.
            </div>
          : <React.Fragment>
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

StudyLessonsPageLessons.propTypes = {
  lessons: StudyLessonsProp,
}

StudyLessonsPageLessons.defaultProps = {
  lessons: StudyLessonsPropDefaults,
}

export default StudyLessonsPageLessons
