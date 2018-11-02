import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {StudyLabelsProp, StudyLabelsPropDefaults} from 'components/StudyLabels'
import LabelPreview from 'components/LabelPreview'
import {isEmpty} from 'utils'

class StudyLabelsPageLabels extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const {labels, study} = this.props
    const {edges, hasMore, isLoading, loadMore} = labels

    const noResults = isEmpty(edges)

    return (
      <div className={this.classes}>
        <div className="mdc-card mdc-card--outlined ph2">
          {isLoading && noResults && <div>Loading...</div>}
          {this.renderLabels()}
          {(hasMore || study.viewerCanAdmin) &&
          <div className="mdc-card__actions">
            <div className="mdc-card__action-buttons">
              {hasMore &&
              <button
                className="mdc-button mdc-button--unelevated mdc-card__action mdc-card__action--button"
                type="button"
                onClick={loadMore}
              >
                More
              </button>}
            </div>
            {study.viewerCanAdmin &&
            <div className="mdc-card__action-icons">
              <button
                className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
                aria-label="New label"
                title="New label"
                onClick={this.props.onAddAction}
              >
                add
              </button>
            </div>}
          </div>}
        </div>
      </div>
    )
  }

  renderLabels() {
    const edges = this.props.labels.edges
    const noResults = isEmpty(edges)

    return (
      <ul className="mdc-list">
        {noResults
        ? <li className="mdc-list-item">No labels were found</li>
        : edges.map(({node}) => (
            node && <LabelPreview.List key={node.id} label={node} />
          ))}
      </ul>
    )
  }
}

StudyLabelsPageLabels.propTypes = {
  labels: StudyLabelsProp,
  onAddAction: PropTypes.func,
  study: PropTypes.shape({
    viewerCanAdmin: PropTypes.bool.isRequired,
  }).isRequired,
}

StudyLabelsPageLabels.defaultProps = {
  labels: StudyLabelsPropDefaults,
  onAddAction: () => {},
  study: {
    viewerCanAdmin: false,
  }
}

export default StudyLabelsPageLabels
