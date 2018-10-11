import * as React from 'react'
import {StudyLessonsProp, StudyLessonsPropDefaults} from 'components/StudyLessons'
import LessonPreview from 'components/LessonPreview'
import {isEmpty} from 'utils'

class LabelPageLessons extends React.Component {
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
          : <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <ul className="mdc-list mdc-list--two-line">
                {edges.map(({node}) => (
                  node && <LessonPreview.List key={node.id} lesson={node} />
                ))}
              </ul>
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

LabelPageLessons.propTypes = {
  lessons: StudyLessonsProp,
}

LabelPageLessons.defaultProps = {
  lessons: StudyLessonsPropDefaults,
}

export default LabelPageLessons
