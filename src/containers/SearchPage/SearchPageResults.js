import * as React from 'react'
import cls from 'classnames'
import {withRouter} from 'react-router-dom'
import TextField, {Icon, Input} from '@material/react-text-field'
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
  }, 100)

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

SearchPageResults.propTypes = {
  search: SearchProp,
}

SearchPageResults.defaultProps = {
  search: SearchPropDefaults,
}

export default withRouter(SearchPageResults)
