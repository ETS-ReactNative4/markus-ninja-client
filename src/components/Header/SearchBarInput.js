import * as React from 'react'
import {
  createRefetchContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import { Link, withRouter } from 'react-router-dom'
import queryString from 'query-string'
import SearchBarResult from './SearchBarResult'
import StudyLink from 'components/StudyLink'
import { debounce, get, isNil, isEmpty } from 'utils'
import { SEARCH_BAR_RESULTS_PER_PAGE } from 'consts'

class SearchBarInput extends React.Component {

  node = null
  form_ = null

  state = {
    cursor: 0,
    cursors: new Map(),
    error: null,
    ids: new Map(),
    loading: true,
    focus: false,
    q: "",
    results: [],
    skip: true,
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
    document.addEventListener('keydown', this.handleKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
    document.removeEventListener('keydown', this.handleKeyDown, false);
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

  handleMouseEnter = (e) => {
    this.setState({ cursor: this.state.cursors.get(e.target.id) })
  }

  handleKeyDown = (e) => {
    const forwardSlash = e.key === '/' || (e.code === 'Slash' && !e.shiftKey)
    const arrowUp = e.key === 'ArrowUp' || e.code === 'ArrowUp'
    const arrowDown = e.key === 'ArrowDown' || e.code === 'ArrowDown'
    const isEnter = e.key === 'Enter' || e.code === 'Enter'
    const isEscape = e.key === 'Escape' || e.code === 'Escape'

    const { cursor, focus } = this.state
    const searchEdges = get(this.props, "query.search.edges", [])
    if (forwardSlash) {
      const activeElement = document.activeElement
      const inputs = ['input', 'select', 'textarea']
      if (activeElement &&
        (inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1 ||
          activeElement.isContentEditable)
      ) {
        return
      }
      e.preventDefault()
      const element = document.getElementById("search-bar-input")
      element.focus()
      this.setState({ focus: true })
    } else if (isEscape) {
      const {focus} = this.state
      if (focus) {
        const element = document.getElementById("search-bar-input")
        element.blur()
        this.setState({ focus: false })
      }
    }

    if (!focus) { return }

    if (arrowUp && cursor > 0) {
      this.setState({ cursor: cursor - 1 })
    } else if (arrowDown && cursor < searchEdges.length) {
      this.setState({ cursor: cursor + 1})
    } else if (isEnter) {
      const element = document.getElementById(this.state.ids.get(cursor))
      element.focus()
      this.setState({ focus: false })
    }
  }

  handleSearchIconKeyDown = (e) => {
    const isEnter = e.key === 'Enter' || e.keyCode === 13
    setTimeout(() => {
      if (isEnter) {
        this.form_.submit()
      }
    }, 0);
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
        const cursors = new Map([
          ["search-bar-this-study", 0],
        ])
        const ids = new Map([
          [0, "search-bar-this-study"],
        ])
        get(this.props, "query.search.edges", []).map((edge, i) => {
          cursors.set(get(edge, "node.id", ""), i+1)
          ids.set(i+1, get(edge, "node.id", ""))
          return null
        })
        this.setState({
          cursors,
          ids,
          loading: false
        })
      },
      {force: true},
    )
  }, 300)

  get classes() {
    const {className} = this.props
    return cls("SearchBarInput", className)
  }

  render() {
    const { cursor, q, loading, focus } = this.state
    // const pathname = get(this.props, "location.pathname", "")
    const searchEdges = get(this.props, "query.search.edges", [])
    // const studyPath = matchPath(pathname, { path: '/:owner/:name' })
    // const isStudyPath =
    //   studyPath &&
    //   studyPath.params.owner !== 'topics' &&
    //   studyPath.params.owner !== 'settings'

    return (
      <div
        ref={node => this.node = node}
        className={this.classes}
        onBlur={this.handleBlur}
      >
        <form ref={node => this.form_ = node} action="/search" acceptCharset="utf8" method="get">
          <div className="mdc-text-field mdc-text-field--outlined mdc-text-field--inline mdc-text-field--with-trailing-icon w-100">
            <input
              id="search-bar-input"
              className="mdc-text-field__input"
              autoComplete="off"
              type="text"
              name="q"
              placeholder="Search..."
              value={q}
              onChange={this.handleChange}
              onFocus={() => this.setState({ focus: true, skip: false })}
            />
            <div className="mdc-notched-outline mdc-theme--background z-behind">
              <svg>
                <path className="mdc-notched-outline__path"></path>
              </svg>
            </div>
            <div className="mdc-notched-outline__idle mdc-theme--background z-behind"></div>
            <i
              className="material-icons mdc-text-field__icon"
              tabIndex="0"
              role="button"
              onClick={() => this.form_.submit()}
              onKeyDown={this.handleSearchIconKeyDown}
            >
              search
            </i>
          </div>
        </form>
        <div className={cls("SearchBarInput__results", {dn: !focus})}>
          {loading && searchEdges.length < 1
          // eslint-disable-next-line jsx-a11y/role-supports-aria-props
          ? <div className="mdc-list mdc-list--non-interactive" aria-orientation="vertical">
              <div className="mdc-list-item">Loading...</div>
            </div>
          // eslint-disable-next-line jsx-a11y/role-supports-aria-props
          : <div className="mdc-list" aria-orientation="vertical">
              {/*isStudyPath &&
              <SearchBarResult
                id="search-bar-this-study"
                selected={cursor === 0}
                as={Link}
                to={{
                  pathname: studyPath.url + "/search",
                  search: queryString.stringify({ q }),
                }}
                onMouseEnter={this.handleMouseEnter}
                onClick={() => this.setState({ focus: false })}
              >
                Search this study...
              </SearchBarResult>*/}
              <SearchBarResult
                id="search-bar-whole-site"
                selected={cursor === 0}
                as={Link}
                to={{
                  pathname: "/search",
                  search: queryString.stringify({ q }),
                }}
                onMouseEnter={this.handleMouseEnter}
                onClick={() => this.setState({ focus: false })}
              >
                Search whole site...
              </SearchBarResult>
              {searchEdges.map(({node}, i) =>
                node &&
                <SearchBarResult key={node.id}
                  id={node.id}
                  selected={cursor === i+1}
                  as={StudyLink}
                  withOwner
                  study={node}
                  onMouseEnter={this.handleMouseEnter}
                  onClick={() => this.setState({ focus: false })}
                />)}
            </div>}
        </div>
      </div>
    )
  }
}

export default withRouter(createRefetchContainer(SearchBarInput,
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
))
