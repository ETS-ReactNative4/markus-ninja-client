import * as React from 'react'
import cls from 'classnames'
import List from 'components/List'
import {UserStudiesProp, UserStudiesPropDefaults} from 'components/UserStudies'
import StudyLink from 'components/StudyLink'
import {isEmpty} from 'utils'

class ViewerStudies extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("ViewerStudies", className)
  }

  render() {
    const {studies} = this.props
    const {edges, hasMore, isLoading, loadMore} = studies
    const noResults = isEmpty(edges)

    return (
      <List className={this.classes}>
        {isLoading
        ? <li className="mdc-list-item">Loading...</li>
        : noResults
          ? <li className="mdc-list-item">No studies were found</li>
        : edges.map(({node}) => (
            node && <StudyLink className="mdc-list-item" key={node.id} study={node} />
          ))}
        {hasMore &&
        <List.Item
          className="mdc-button mdc-theme--primary"
          onClick={loadMore}
        >
          Load More
        </List.Item>}
      </List>
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
