import * as React from 'react'
import cls from 'classnames'
import StudyPreview from 'components/StudyPreview'
import {isEmpty} from 'utils'

class UserStudies extends React.PureComponent {
  get classes() {
    const {className} = this.props
    return cls("UserStudies mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const {edges, hasMore, isLoading, loadMore} = this.props.search

    return (
      <div className={this.classes}>
        {isLoading
        ? <div>Loading...</div>
        : (isEmpty(edges)
          ? <span className="mr1">
              No studies found
            </span>
          : <div className="mdc-layout-grid__inner">
              {edges.map(({node}) => (
                node &&
                <React.Fragment key={node.id}>
                  <StudyPreview.User
                    className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
                    study={node}
                  />
                  <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                </React.Fragment>
              ))}
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

export default UserStudies
