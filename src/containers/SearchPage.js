import React, {Component} from 'react'
import cls from 'classnames'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import SearchResultItemPreview from 'components/SearchResultItemPreview'
import Counter from 'components/Counter'
import {debounce, get, isEmpty} from 'utils'

class SearchPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this._query,
    }
  }

  handleChange = (e) => {
    this.setState({q: e.target.value})
    this._redirect()
  }

  _redirect = debounce(() => {
    const {location, history} = this.props
    const {q} = this.state

    const searchQuery = queryString.parse(get(location, "search", ""))
    searchQuery.q = isEmpty(q) ? undefined : q

    const search = queryString.stringify(searchQuery)

    history.push({pathname: location.pathname, search})
  }, 300)

  get classes() {
    const {className} = this.props
    return cls("SearchPage mdc-layout-grid", className)
  }

  get _query() {
    const searchQuery = queryString.parse(get(this.props, "location.search", ""))
    const o = get(searchQuery, "o", "desc").toUpperCase()
    const q = get(searchQuery, "q", "")
    const t = get(searchQuery, "type", "study").toUpperCase()
    const s = (() => {
      switch (get(searchQuery, "s", "").toLowerCase()) {
        case "advanced":
          return "ADVANCED_AT"
        case "apples":
          return "APPLE_COUNT"
        case "created":
          return "CREATED_AT"
        case "comments":
          return "COMMENT_COUNT"
        case "lessons":
          return "LESSON_COUNT"
        case "studies":
          return "STUDY_COUNT"
        case "updated":
          return "UPDATED_AT"
        default:
          return "BEST_MATCH"
      }
    })()

    return {o, q, t, s}
  }

  render() {
    const searchQuery = this._searchQuery
    const query = get(searchQuery, "q", "*")

    const orderBy = {
      direction,
      field,
    }
    const pathname = get(props, "location.pathname")
    const search = get(props, "search", {})
    const searchEdges = get(props, "search.edges", [])
    searchQuery.type = "course"
    const searchCourses = queryString.stringify(searchQuery)
    searchQuery.type = "lesson"
    const searchLessons = queryString.stringify(searchQuery)
    searchQuery.type = "study"
    const searchStudies = queryString.stringify(searchQuery)
    searchQuery.type = "topic"
    const searchTopics = queryString.stringify(searchQuery)
    searchQuery.type = "user"
    const searchUsers = queryString.stringify(searchQuery)
    searchQuery.type = "user_asset"
    const searchUserAssets = queryString.stringify(searchQuery)
    return (
      <div className="SearchPage">
        <nav>
          <Link to={{pathname, search: searchCourses}}>
            Courses
            <Counter>{search.courseCount}</Counter>
          </Link>
          <Link to={{pathname, search: searchLessons}}>
            Lessons
            <Counter>{search.lessonCount}</Counter>
          </Link>
          <Link to={{pathname, search: searchStudies}}>
            Studies
            <Counter>{search.studyCount}</Counter>
          </Link>
          <Link to={{pathname, search: searchTopics}}>
            Topics
            <Counter>{search.topicCount}</Counter>
          </Link>
          <Link to={{pathname, search: searchUsers}}>
            Users
            <Counter>{search.userCount}</Counter>
          </Link>
          <Link to={{pathname, search: searchUserAssets}}>
            UserAssets
            <Counter>{search.userAssetCount}</Counter>
          </Link>
        </nav>
        <div className="SearchPage__results">
          {isEmpty(searchEdges)
          ? <span>0 results</span>
          : searchEdges.map(({node}) => (
              <SearchResultItemPreview key={node.id} item={node} />
            ))}
        </div>
      </div>
    )
  }
}

export default withRouter(SearchPage)
