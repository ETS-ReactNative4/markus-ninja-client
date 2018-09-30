import * as React from 'react'
import cls from 'classnames'
import {SearchProp, SearchPropDefaults} from 'components/Search'
import StudyPreview from 'components/StudyPreview'

class ViewerStudies extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("ViewerStudies mdc-list", className)
  }

  render() {
    const {search} = this.props
    const {edges, hasMore, loadMore} = search

    return (
      <div className={this.classes}>
        {edges.map(({node}) => (
          node && <StudyPreview.Link className="mdc-list-item" key={node.id} study={node} />
        ))}
        {hasMore &&
        <div className="mdc-list-item">
          <button
            className="mdc-button mdc-button--unelevated"
            onClick={loadMore}
          >
            More
          </button>
        </div>}
      </div>
    )
  }
}

ViewerStudies.propTypes = {
  search: SearchProp,
}

ViewerStudies.defaultProps = {
  search: SearchPropDefaults,
}

export default ViewerStudies
