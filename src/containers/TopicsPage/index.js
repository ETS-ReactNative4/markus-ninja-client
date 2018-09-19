import * as React from 'react'
import cls from 'classnames'
import queryString from 'query-string'
import Search from 'components/Search'
import TopicsPageResults from './TopicsPageResults'
import {get} from 'utils'

class TopicsPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("TopicsPage mdc-layout-grid mw8", className)
  }

  get _query() {
    const searchQuery = queryString.parse(get(this.props, "location.search", ""))
    const direction = get(searchQuery, "o", "desc").toUpperCase()
    const query = get(searchQuery, "q", "")
    const field = (() => {
      switch (get(searchQuery, "s", "").toLowerCase()) {
        case "name":
          return "NAME"
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
    }
  }

  render() {
    const query = this._query

    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__inner">
          <h4 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            Topics
          </h4>
          <Search
            type="TOPIC"
            query={query.query}
            orderBy={query.orderBy}
          >
            <TopicsPageResults />
          </Search>
        </div>
      </div>
    )
  }
}

export default TopicsPage
