import * as React from 'react'
import {withRouter} from 'react-router-dom'
import TextField, {Icon, Input} from '@material/react-text-field'
import queryString from 'query-string'
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
    const {edges, hasMore, isLoading, loadMore} = topicables

    const noResults = isEmpty(edges)

    return (
      <React.Fragment>
        <TopicNav counts={topicables.counts} />
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          {this.renderInput()}
        </div>
        {isLoading && noResults
        ? <div>Loading...</div>
        : (noResults
          ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              No topicables were found.
            </div>
          : <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <ul className="mdc-list mdc-list--two-line">
                {edges.map(({node}) => {
                  if (!node) {
                    return null
                  }
                  switch(node.__typename) {
                    case "Course":
                      return <CoursePreview.Search key={node.id} course={node} />
                    case "Study":
                      return <StudyPreview.Search key={node.id} study={node} />
                    default:
                      return null
                  }
                })}
              </ul>
              {hasMore &&
              <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                <button
                  className="mdc-button mdc-button--unelevated"
                  type="button"
                  onClick={loadMore}
                >
                  More
                </button>
              </div>}
            </div>)}
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
}

TopicPageTopicables.propTypes = {
  topicables: TopicTopicablesProp,
}

TopicPageTopicables.defaultProps = {
  topicables: TopicTopicablesPropDefaults,
}

export default withRouter(TopicPageTopicables)
