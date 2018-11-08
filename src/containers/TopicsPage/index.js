import * as React from 'react'
import cls from 'classnames'
import queryString from 'query-string'
import Search from 'components/Search'
import SearchResults from 'components/SearchResults'
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
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            {this.renderInput()}
          </div>
          <Search
            type="TOPIC"
            query={query.query}
            orderBy={query.orderBy}
          >
            <SearchResults />
          </Search>
        </div>
      </div>
    )
  }

  renderInput() {
    const {q} = this.state

    return (
      <div className="mdc-text-field mdc-text-field--outlined w-100 mdc-text-field--inline mdc-text-field--with-trailing-icon">
        <input
          className="mdc-text-field__input"
          autoComplete="off"
          type="text"
          name="q"
          placeholder="Search..."
          value={q}
          onChange={this.handleChange}
        />
        <div className="mdc-notched-outline mdc-theme--background z-behind">
          <svg>
            <path className="mdc-notched-outline__path"></path>
          </svg>
        </div>
        <div className="mdc-notched-outline__idle mdc-theme--background z-behind"></div>
        <i className="material-icons mdc-text-field__icon">
          search
        </i>
      </div>
    )
  }
}

export default TopicsPage
