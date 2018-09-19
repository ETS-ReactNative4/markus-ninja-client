import * as React from 'react'
import {withRouter} from 'react-router-dom'
import queryString from 'query-string'
import {SearchResultsProp, SearchResultsPropDefaults} from 'components/Search'
import TopicPreview from 'components/TopicPreview'
import {debounce, get, isEmpty} from 'utils'

class TopicSearchResults extends React.Component {
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

  render() {
    const {search} = this.props
    const {edges, hasMore, isLoading, loadMore} = search

    return (
      <React.Fragment>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          {this.renderInput()}
        </div>
        {isLoading
        ? <div>Loading</div>
        : isEmpty(edges)
          ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              No topics were found.
            </div>
        : <React.Fragment>
            {edges.map(({node}) => (
              node &&
              <div key={node.id} className="mdc-layout-grid__cell">
                <div className="mdc-card mdc-card--outlined">
                  <TopicPreview.Search
                    className="mdc-card__primary-action pa3 h-100"
                    topic={node}
                  />
                </div>
              </div>
            ))}
            {hasMore &&
            <button
              className="mdc-button mdc-button--unelevated"
              onClick={loadMore}
            >
              More
            </button>}
          </React.Fragment>}
      </React.Fragment>
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

TopicSearchResults.propTypes = {
  search: SearchResultsProp,
}

TopicSearchResults.defaultProps = {
  search: SearchResultsPropDefaults,
}

export default withRouter(TopicSearchResults)
