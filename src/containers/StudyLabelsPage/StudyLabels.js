import * as React from 'react'
import cls from 'classnames'
import pluralize from 'pluralize'
import {SearchResultsProp, SearchResultsPropDefaults} from 'components/Search'
import LabelPreview from 'components/LabelPreview'
import Counter from 'components/Counter'
import {get, isEmpty} from 'utils'

class StudyLabels extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudyLabels mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const {search} = this.props
    const {edges, hasMore, isLoading, loadMore} = search
    const labelCount = get(search, "counts.label", 0)

    return (
      <div className={this.classes}>
        <h5>
          {pluralize("Labels", labelCount)}
          <Counter>{labelCount}</Counter>
        </h5>
        {isLoading
        ? <div>Loading...</div>
        : (isEmpty(edges)
          ? <span className="mr1">
              No labels were found.
            </span>
          : <div className="mdc-layout-grid__inner">
              <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
              {edges.map(({node}) =>
                node &&
                <React.Fragment key={node.id}>
                  <LabelPreview.Study
                    className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
                    label={node}
                  />
                  <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                </React.Fragment>
              )}
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

StudyLabels.propTypes = {
  search: SearchResultsProp,
}

StudyLabels.defaultProps = {
  search: SearchResultsPropDefaults,
}


export default StudyLabels
