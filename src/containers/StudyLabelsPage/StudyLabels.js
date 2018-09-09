import * as React from 'react'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
import LabelPreview from 'components/LabelPreview'
import Counter from 'components/Counter'
import { get } from 'utils'

class StudyLabels extends React.Component {
  render() {
    const {search} = this.props

    return (
      <div className="StudyLabels">
        <h5>
          <Counter>{search.totalCount}</Counter>
          {pluralize("Labels", search.totalCount)}
        </h5>
        <div className="StudyLabels__labels">
          {search.edges.map(({node}) =>
            <LabelPreview key={get(node, "id", "")} label={node} />
          )}
          {search.hasMore &&
          <button
            className="mdc-button mdc-button--unelevated"
            onClick={search.loadMore}
          >
            More
          </button>}
        </div>
      </div>
    )
  }
}

StudyLabels.propTypes = {
  search: PropTypes.shape({
    edges: PropTypes.array,
    hasMore: PropTypes.bool,
    loadMore: PropTypes.func,
    totalCount: PropTypes.number,
  })
}

StudyLabels.defaultProps = {
  search: {
    edges: [],
    hasMore: false,
    loadMore: () => {},
    totalCount: 0,
  }
}

export default StudyLabels
