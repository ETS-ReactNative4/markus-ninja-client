import * as React from 'react'
import cls from 'classnames'
import pluralize from 'pluralize'
import {SearchProp, SearchPropDefaults} from 'components/Search'
import CoursePreview from 'components/CoursePreview'
import LessonPreview from 'components/LessonPreview'
import StudyPreview from 'components/StudyPreview'
import TopicPreview from 'components/TopicPreview'
import UserPreview from 'components/UserPreview'
import UserAssetPreview from 'components/UserAssetPreview'
import {isEmpty} from 'utils'

class ListSearchResults extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  get type() {
    const {search} = this.props
    switch (search.type) {
      case "COURSE":
        return "course"
      case "LESSON":
        return "lesson"
      case "STUDY":
        return "study"
      case "TOPIC":
        return "topic"
      case "USER":
        return "user"
      case "USER_ASSET":
        return "asset"
      default:
        return ""
    }
  }

  render() {
    const {search} = this.props
    const {hasMore, loadMore} = search

    return (
      <div className={this.classes}>
        <div className="mdc-card mdc-card--outlined ph2">
          {search.type === 'USER_ASSET'
          ? this.renderAssetResults()
          : this.renderListResults()}
          {hasMore &&
          <div className="mdc-card__actions">
            <div className="mdc-card__action-buttons">
              <button
                className="mdc-button mdc-button--unelevated mdc-card__action mdc-card__action--button"
                type="button"
                onClick={loadMore}
              >
                More
              </button>
            </div>
          </div>}
        </div>
      </div>
    )
  }

  renderAssetResults() {
    const {search} = this.props
    const {edges, isLoading} = search
    const noResults = isEmpty(edges)

    if (isLoading || noResults) {
      return (
        <ul className="mdc-list mdc-list--two-line">
          {isLoading
          ? <li className="mdc-list-item">Loading...</li>
          : noResults &&
            <li className="mdc-list-item">No {pluralize(this.type)} were found</li>}
        </ul>
      )
    }

    return (
      <div className="w-100 pv2">
        <ul className="rn-image-list mdc-image-list mdc-image-list--with-text-protection">
          {edges.map(({node}) => (
            node && this.renderNodePreview(node)
          ))}
        </ul>
      </div>
    )
  }

  renderListResults() {
    const {search} = this.props
    const {dataIsStale, edges, isLoading} = search
    const noResults = isEmpty(edges)

    return (
      <ul className="mdc-list mdc-list--two-line">
        {isLoading && (dataIsStale || noResults)
        ? <li className="mdc-list-item">Loading...</li>
        : noResults
          ? <li className="mdc-list-item">No {pluralize(this.type)} were found</li>
        : edges.map(({node}) => (
            node && this.renderNodePreview(node)
          ))}
      </ul>
    )
  }

  renderNodePreview(node) {
    const {search} = this.props
    switch (search.type) {
      case "COURSE":
        return <CoursePreview.List key={node.id} course={node} />
      case "LESSON":
        return <LessonPreview.List key={node.id} lesson={node} />
      case "STUDY":
        return <StudyPreview.List key={node.id} study={node} />
      case "TOPIC":
        return <TopicPreview.List key={node.id} topic={node} />
      case "USER":
        return <UserPreview.List key={node.id} user={node} />
      case "USER_ASSET":
        return <UserAssetPreview key={node.id} asset={node} />
      default:
        return ""
    }
  }
}

ListSearchResults.propTypes = {
  search: SearchProp,
}

ListSearchResults.defaultProps = {
  search: SearchPropDefaults,
}

export default ListSearchResults
