import * as React from 'react'
import {withRouter} from 'react-router-dom'
import TextField, {Icon, Input} from '@material/react-text-field'
import queryString from 'query-string'
import pluralize from 'pluralize'
import {TopicTopicablesProp, TopicTopicablesPropDefaults} from 'components/TopicTopicables'
import CoursePreview from 'components/CoursePreview'
import StudyPreview from 'components/StudyPreview'
import {debounce, get, isEmpty} from 'utils'
import TopicNav from './TopicNav'

class TopicPageTopicables extends React.Component {
  constructor(props) {
    super(props)

    const searchQuery = queryString.parse(get(this.props, "location.search", ""))
    const {o, q, s, t} = searchQuery

    this.state = {o, q, s, t}
  }

  handleChange = (e) => {
    const q = e.target.value
    this.setState({q})
    this._redirect(q)
  }

  _redirect = debounce((q) => {
    const {location, history} = this.props

    const searchQuery = queryString.parse(get(location, "search", ""))
    searchQuery.q = isEmpty(q) ? undefined : q

    const search = queryString.stringify(searchQuery)

    history.replace({pathname: location.pathname, search})
  }, 300)

  render() {
    const {topicables} = this.props
    const {hasMore, loadMore} = topicables

    return (
      <React.Fragment>
        <TopicNav counts={topicables.counts} />
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          {this.renderInput()}
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <div className="mdc-card mdc-card--outlined ph2">
            {this.renderTopicables()}
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
      </React.Fragment>
    )
  }

  renderInput() {
    const {q} = this.state

    return (
      <TextField
        fullWidth
        label="Search..."
        trailingIcon={<Icon><i className="material-icons">search</i></Icon>}
      >
        <Input
          name="q"
          autoComplete="off"
          placeholder="Search..."
          value={q}
          onChange={this.handleChange}
        />
      </TextField>
    )
  }

  renderTopicables() {
    const {topicables} = this.props
    const {edges, isLoading, type} = topicables
    const noResults = isEmpty(edges)

    return (
      <ul className="mdc-list mdc-list--two-line">
        {isLoading
        ? <li className="mdc-list-item">Loading...</li>
        : noResults
          ? <li className="mdc-list-item">
              No {pluralize(type.toLowerCase())} were found.
            </li>
        : edges.map(({node}) => {
            if (!node) {
              return null
            }
            switch(node.__typename) {
              case "Course":
                return <CoursePreview.List key={node.id} course={node} />
              case "Study":
                return <StudyPreview.List key={node.id} study={node} />
              default:
                return null
            }
          })}
      </ul>
    )
  }
}

TopicPageTopicables.propTypes = {
  topicables: TopicTopicablesProp,
}

TopicPageTopicables.defaultProps = {
  topicables: TopicTopicablesPropDefaults,
}

export default withRouter(TopicPageTopicables)
