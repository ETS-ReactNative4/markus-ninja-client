import * as React from 'react'
import cls from 'classnames'
import {withRouter} from 'react-router-dom'
import queryString from 'query-string'
import {SearchResultsProp, SearchResultsPropDefaults} from 'components/Search'
import SearchNav from './SearchNav'
import SearchResultItemPreview from 'components/SearchResultItemPreview'
import {debounce, get, isEmpty} from 'utils'

class SearchPageResults extends React.Component {
  constructor(props) {
    super(props)

    const searchQuery = queryString.parse(get(this.props, "location.search", ""))
    const q = get(searchQuery, "q", "")

    this.state = {q}
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
    return cls("SearchPageResults flex w-100", className)
  }

  render() {
    const {search} = this.props
    const {edges, hasMore, loadMore} = search

    return (
      <div className={this.classes}>
        <SearchNav counts={search.counts} />
        <div className="flex-auto">
          <div className="mdc-layout-grid">
            <div className="mdc-layout-grid__inner">
              <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                {this.renderInput()}
              </div>
              <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                {isEmpty(edges)
                ? <span className="mr1">
                    No results were found.
                  </span>
                : <div className="SearchPageResults__results">
                    {edges.map(({node}) => (
                      node && <SearchResultItemPreview key={node.id} item={node} />
                    ))}
                    {hasMore &&
                    <button
                      className="mdc-button mdc-button--unelevated"
                      onClick={loadMore}
                    >
                      More
                    </button>}
                  </div>
                }
              </div>
            </div>
          </div>
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

SearchPageResults.propTypes = {
  search: SearchResultsProp,
}

SearchPageResults.defaultProps = {
  search: SearchResultsPropDefaults,
}

export default withRouter(SearchPageResults)
