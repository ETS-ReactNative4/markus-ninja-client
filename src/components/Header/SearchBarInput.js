import * as React from 'react'
import {
  createRefetchContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import { Route, Link } from 'react-router-dom'
import queryString from 'query-string'
import Edge from 'components/Edge'
import ListItem from 'components/ListItem'
import StudyLink from 'components/StudyLink'
import { debounce, get, isNil, isEmpty } from 'utils'
import { SEARCH_BAR_RESULTS_PER_PAGE } from 'consts'

class SearchBarInput extends React.Component {
  state = {
    cursor: 0,
    error: null,
    loading: true,
    focus: false,
    q: "",
    results: [],
    skip: true,
  }

  node = null

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.skip && !this.state.skip) {
      this._refetch(this.state.q)
    }
  }

  handleBlur = (e) => {
    setTimeout(() => {
      if (!this.node.contains(document.activeElement)) {
        this.setState({ focus: false })
      }
    }, 0);
  }

  handleKeyDown = (e) => {
    const { cursor } = this.state
    const searchEdges = get(this.props, "query.search.edges", [])
    if (e.keyCode === 38 && cursor > 0) {
      this.setState({ cursor: cursor - 1 })
    } else if (e.keyCode === 40 && cursor < searchEdges.length) {
      this.setState({ cursor: cursor + 1 })
    }
  }

  handleClick = (e) => {
    if (!this.node.contains(e.target)) {
      this.setState({ focus: false })
    }
  }

  handleChange = (e) => {
    const q = e.target.value
    this.setState({
      q,
    })
    this._refetch(q)
  }

  _refetch = debounce((query) => {
    this.setState({
      loading: true,
    })
    this.props.relay.refetch(
      {
        count: SEARCH_BAR_RESULTS_PER_PAGE,
        query: isEmpty(query) ? "*" : query,
        skip: this.state.skip,
      },
      null,
      (error) => {
        if (!isNil(error)) {
          console.log(error)
        }
        this.setState({ loading: false })
      },
      {force: true},
    )
  }, 300)


  render() {
    const { cursor, q, loading, focus } = this.state
    const searchEdges = get(this.props, "query.search.edges", [])
    return (
      <div
        ref={node => this.node = node}
        className="SearchBarInput relative"
        onKeyDown={this.handleKeyDown}
        onBlur={this.handleBlur}
      >
        <form action="/search" acceptCharset="utf8" method="get">
          <label
            htmlFor="search-query"
            className="relative"
          >
            <input
              id="search-query"
              autoComplete="off"
              className="SearchBar__input"
              type="text"
              name="q"
              placeholder="Search..."
              value={q}
              onChange={this.handleChange}
              onFocus={() => this.setState({ focus: true, skip: false })}
            />
            <div className={cls("search-results absolute overflow-hidden w-100", {dn: !focus})}>
              {loading && searchEdges.length < 1
              // eslint-disable-next-line jsx-a11y/role-supports-aria-props
              ? <div className="mdc-list mdc-list--non-interactive" aria-orientation="vertical">
                  <div className="mdc-list-item">Loading...</div>
                </div>
              // eslint-disable-next-line jsx-a11y/role-supports-aria-props
              : <div className="mdc-list" aria-orientation="vertical">
                  <Route path="/:owner/:name" render={({ match }) =>
                    <ListItem
                      active={cursor === 0}
                      as={Link}
                      to={{
                        pathname: match.url + "/search",
                        search: queryString.stringify({ q }),
                      }}
                    >
                      Search this study...
                    </ListItem>}
                  />
                  {searchEdges.length > 0
                  ? searchEdges.map((edge, i) =>
                      <Edge key={get(edge, "node.id", "")} edge={edge} render={({ node }) =>
                        <ListItem
                          active={cursor === i+1}
                          as={StudyLink}
                          withOwner
                          study={node}
                        />
                      }/>)
                  : <div className="mdc-list-item">No results found...</div>}
                </div>}
            </div>
          </label>
        </form>
      </div>
    )
  }
}

export default createRefetchContainer(SearchBarInput,
  {
    query: graphql`
      fragment SearchBarInput_query on Query {
        search(first: $count, query: $query, type: STUDY)
          @skip(if: $skip)
          @connection(key:"SearchBarInput_search", filters: []) {
          edges {
            node {
              id
              ...on Study {
                ...StudyLink_study
              }
            }
          }
        }
      }
    `
  },
  graphql`
    query SearchBarInputRefetchQuery(
      $count: Int!
      $query: String!,
      $skip: Boolean!
    ) {
      ...SearchBarInput_query
    }
  `,
)