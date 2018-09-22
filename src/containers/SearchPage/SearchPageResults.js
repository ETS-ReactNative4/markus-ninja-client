import * as React from 'react'
import cls from 'classnames'
import {withRouter} from 'react-router-dom'
import queryString from 'query-string'
import {SearchProp, SearchPropDefaults} from 'components/Search'
import SearchNav from './SearchNav'
import SearchResults from 'components/SearchResults'
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

    history.replace({pathname: location.pathname, search})
  }, 300)

  get classes() {
    const {className} = this.props
    return cls("SearchPageResults flex w-100", className)
  }

  render() {
    const {search} = this.props

    return (
      <div className={this.classes}>
        <SearchNav counts={search.counts} />
        <div className="flex-auto">
          <div className="mdc-layout-grid">
            <div className="mdc-layout-grid__inner">
              <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                {this.renderInput()}
              </div>
              <SearchResults search={search} />
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
  search: SearchProp,
}

SearchPageResults.defaultProps = {
  search: SearchPropDefaults,
}

export default withRouter(SearchPageResults)
