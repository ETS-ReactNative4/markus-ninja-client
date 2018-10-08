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
          : <React.Fragment>
              {edges.map(({node}) => (
                node &&
                <React.Fragment key={node.id}>
                  <LabelPreview.Study
                    className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
                    label={node}
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

StudyLabelsPageLabels.propTypes = {
  labels: StudyLabelsProp,
}

StudyLabelsPageLabels.defaultProps = {
  labels: StudyLabelsPropDefaults,
}

export default StudyLabelsPageLabels
