import * as React from 'react'
import cls from 'classnames'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import Search from 'components/Search'
import SearchPageResults from './SearchPageResults'
import {get} from 'utils'

class SearchPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("SearchPage", className)
  }

  get _query() {
    const searchQuery = queryString.parse(get(this.props, "location.search", ""))
    const direction = get(searchQuery, "o", "desc").toUpperCase()
    const query = get(searchQuery, "q", "")
    const type = get(searchQuery, "t", "study").toUpperCase()
    const field = (() => {
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

    return {
      orderBy: {
        direction,
        field,
      },
      query,
      type,
    }
  }

  render() {
    const query = this._query

    return (
      <div className={this.classes}>
        <Search
          type={query.type}
          query={query.query}
          orderBy={query.orderBy}
          fragment="list"
        >
          <SearchPageResults />
        </Search>
      </div>
    )
  }
}

export default withRouter(SearchPage)
