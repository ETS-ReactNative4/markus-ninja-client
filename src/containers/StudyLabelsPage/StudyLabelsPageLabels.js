import * as React from 'react'
import {StudyLabelsProp, StudyLabelsPropDefaults} from 'components/StudyLabels'
import LabelPreview from 'components/LabelPreview'
import {isEmpty} from 'utils'

class StudyLabelsPageLabels extends React.Component {
  render() {
    const {labels} = this.props
    const {edges, hasMore, isLoading, loadMore} = labels

    const noResults = isEmpty(edges)

    return (
      <React.Fragment>
        {isLoading && noResults
        ? <div>Loading...</div>
        : (noResults
          ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              No labels were found.
            </div>
          : <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <ul className="mdc-list">
                {edges.map(({node}) => (
                  node && <LabelPreview.List key={node.id} label={node} />
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

StudyLabelsPageLabels.propTypes = {
  labels: StudyLabelsProp,
}

StudyLabelsPageLabels.defaultProps = {
  labels: StudyLabelsPropDefaults,
}

export default StudyLabelsPageLabels
