import * as React from 'react'
import cls from 'classnames'
import List from 'components/mdc/List'
import {UserStudiesProp, UserStudiesPropDefaults} from 'components/UserStudies'
import StudyLink from 'components/StudyLink'
import {filterDefinedReactChildren, isEmpty} from 'utils'

class ViewerStudies extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("ViewerStudies", className)
  }

  render() {
    const {edges, isLoading, hasMore, loadMore} = this.props.studies
    const noResults = isEmpty(edges)

    const listItems =
      isLoading
      ? [<List.Item><List.Item.Text primaryText="Loading..." /></List.Item>]
      : noResults
        ? [<List.Item><List.Item.Text primaryText="No studies were found" /></List.Item>]
      : edges.map(({node}) => (
          node && <List.Item key={node.id}><StudyLink study={node} /></List.Item>
        ))
    if (hasMore) {
      listItems.push(
        <List.Item
          className="mdc-button mdc-theme--primary"
          onClick={loadMore}
        >
          <List.Item.Text primaryText="Load More" />
        </List.Item>
      )
    }

    return (
      <List className={this.classes} items={filterDefinedReactChildren(listItems)} />
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
