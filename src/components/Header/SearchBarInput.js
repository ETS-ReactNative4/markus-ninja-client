import * as React from 'react'
import {
  createRefetchContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import { Link, withRouter } from 'react-router-dom'
import queryString from 'query-string'
import TextField, {Input} from '@material/react-text-field'
import { debounce, get, isNil, isEmpty } from 'utils'

import { SEARCH_BAR_RESULTS_PER_PAGE } from 'consts'

class SearchBarInput extends React.Component {
  constructor(props) {
    super(props)

    this.root = React.createRef()
    this.form = React.createRef()

    this.state = {
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
    const {cursor} = this.state
    const newSearchEdges = get(this.props, "query.search.edges", [])
    const oldSearchEdges = get(prevProps, "query.search.edges", [])
    if (prevState.skip && !this.state.skip) {
      this._refetch(this.state.q)
    } else if (newSearchEdges.length !== oldSearchEdges.length) {
      this.setState({cursor: Math.min(cursor, newSearchEdges.length)})
    }
  }

  handleBlur = (e) => {
    setTimeout(() => {
      if (!this.root.current.contains(document.activeElement)) {
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
      if (element) {
        element.focus()
        element.select()
      }
      this.setState({ focus: true })
    } else if (isEscape) {
      const {focus} = this.state
      if (focus) {
        const element = document.getElementById("search-bar-input")
        element && element.blur()
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
      element && element.focus()
      this.setState({ focus: false })
    }
  }

  handleClick = (e) => {
    if (!this.root.current.contains(e.target)) {
      this.setState({ focus: false })
    }
  }

  handleChange = (e) => {
    const q = e.target.value
    this.setState({
      loading: true,
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
          ["search-bar-whole-site", 0],
        ])
        const ids = new Map([
          [0, "search-bar-whole-site"],
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

  handleClickSearchResult = (e) => {
    this.setState({
      focus: false,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const {q} = this.state

    this.props.history.push({
      pathname: "/search",
      search: queryString.stringify({ q }),
    })

    this.setState({
      focus: false,
    })
  }

  get classes() {
    const {className} = this.props
    return cls("SearchBarInput", className)
  }

  render() {
    return (
      <div
        ref={this.root}
        className={this.classes}
        onBlur={this.handleBlur}
      >
        {this.renderForm()}
        {this.renderResults()}
      </div>
    )
  }

  renderForm() {
    const {q} = this.state

    return (
      <form ref={this.form} onSubmit={this.handleSubmit}>
        <TextField
          className="w-100"
          label="Search..."
          trailingIcon={
            <button
              type="submit"
              className="mdc-icon-button material-icons"
              tabIndex="0"
            >
              search
            </button>
          }
        >
          <Input
            id="search-bar-input"
            name="q"
            value={q}
            autoComplete="off"
            onChange={this.handleChange}
            onFocus={() => this.setState({ focus: true, skip: false })}
          />
        </TextField>
      </form>
    )
  }

  renderResults() {
    const { cursor, q, loading, focus } = this.state
    const searchEdges = get(this.props, "query.search.edges", [])

    return (
      <div className={cls("SearchBarInput__results", {dn: !focus})}>
        {// eslint-disable-next-line jsx-a11y/role-supports-aria-props
        <ul className="mdc-list" aria-orientation="vertical">
          {loading
          ? <li className="mdc-list-item">Loading...</li>
          : <React.Fragment>
              <Link
                id="search-bar-whole-site"
                className={cls("mdc-list-item", {"mdc-list-item--selected": cursor === 0})}
                to={{
                  pathname: "/search",
                  search: queryString.stringify({ q }),
                }}
                onMouseEnter={this.handleMouseEnter}
                onClick={this.handleClickSearchResult}
              >
                Search whole site...
              </Link>
              {searchEdges.map(({node}, i) =>
                node &&
                <Link key={node.id}
                  id={node.id}
                  className={cls("mdc-list-item", {"mdc-list-item--selected": cursor === i+1})}
                  to={node.resourcePath}
                  onMouseEnter={this.handleMouseEnter}
                  onClick={this.handleClickSearchResult}
                >
                  {node.nameWithOwner}
                </Link>)}
            </React.Fragment>}
        </ul>}
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
                nameWithOwner
                resourcePath
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
