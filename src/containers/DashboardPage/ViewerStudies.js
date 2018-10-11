import * as React from 'react'
import cls from 'classnames'
import {UserStudiesProp, UserStudiesPropDefaults} from 'components/UserStudies'
import StudyLink from 'components/StudyLink'

class ViewerStudies extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("ViewerStudies mdc-list", className)
  }

  render() {
    const {studies} = this.props
    const {edges, hasMore, loadMore} = studies

    return (
      <div className={this.classes}>
        {edges.map(({node}) => (
          node && <StudyLink className="mdc-list-item" key={node.id} study={node} />
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
  studies: UserStudiesProp,
}

ViewerStudies.defaultProps = {
  studies: UserStudiesPropDefaults,
}

export default ViewerStudies
