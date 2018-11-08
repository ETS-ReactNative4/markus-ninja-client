import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {StudyLabelsProp, StudyLabelsPropDefaults} from 'components/StudyLabels'
import LabelPreview from 'components/LabelPreview'
import Context from 'containers/StudyPage/Context'
import {isEmpty} from 'utils'


class StudyLabelsPageLabels extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const {toggleCreateLabelDialog} = this.context
    const {labels, study} = this.props
    const {hasMore, loadMore} = labels

    return (
      <div className={this.classes}>
        <div className="mdc-card mdc-card--outlined ph2">
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
            <div className="mdc-card__action-icons">
              {study.viewerCanAdmin &&
              <button
                type="button"
                className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
                onClick={toggleCreateLabelDialog}
                aria-label="New label"
                title="New label"
              >
                add
              </button>}
            </div>
          </div>}
        </div>
      </div>
    )
  }

  renderLabels() {
    const {labels} = this.props
    const {dataIsStale, edges, isLoading} = labels
    const noResults = isEmpty(edges)

    return (
      <ul className="mdc-list">
        {isLoading && (dataIsStale || noResults)
        ? <li className="mdc-list-item">Loading...</li>
        : noResults
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
  study: PropTypes.shape({
    viewerCanAdmin: PropTypes.bool.isRequired,
  }).isRequired,
}

StudyLabelsPageLabels.defaultProps = {
  labels: StudyLabelsPropDefaults,
  study: {
    viewerCanAdmin: false,
  }
}

StudyLabelsPageLabels.contextType = Context

export default StudyLabelsPageLabels
