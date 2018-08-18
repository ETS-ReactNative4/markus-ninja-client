import * as React from 'react'
import {
  createRefetchContainer,
  graphql,
} from 'react-relay'
import Edge from 'components/Edge'
import { Link } from 'react-router-dom'
import StudyLink from './StudyLink.js'
import { debounce, get, isNil, isEmpty } from 'utils'
import { SEARCH_BAR_RESULTS_PER_PAGE } from 'consts'

class SearchViewerStudies extends React.Component {
  state = {
    error: null,
    loading: false,
    q: "",
  }

  handleChange = (e) => {
    const q = e.target.value
    this.setState({
      q,
    })
    this._refetch(q)
  }

  _hasMore = () => {
    return get(this.props, "query.search.pageInfo.hasNextPage", false)
  }

  _loadMore = () => {
    const { loading, q } = this.state
    const after = get(this.props, "query.search.pageInfo.endCursor")

    if (!this._hasMore()) {
      console.log("Nothing more to load")
      return
    } else if (loading) {
      console.log("Request is already pending")
      return
    }

    this._refetch(q, after)
  }

  _refetch = debounce((query, after) => {
    this.setState({
      loading: true,
    })
    this.props.relay.refetch(
      {
        count: SEARCH_BAR_RESULTS_PER_PAGE,
        after,
        query: isEmpty(query) ? "*" : query,
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
    const { q } = this.state
    const studyEdges = get(this.props, "query.search.edges", [])

    return (
      <div className="SearchViewerStudies mdc-list mdc-list--non-interactive">
        <div role="separator" className="mdc-list-divider"></div>
        <div className="mdc-list-item">
          <div className="flex justify-between items-center w-100">
            <span className="mdc-typography--headline6">Studies</span>
            <Link className="mdc-button mdc-button--unelevated" to="/new">New</Link>
          </div>
        </div>
        <div className="mdc-list-item">
          <input
            id="studies-query"
            className="w-100"
            autoComplete="off"
            type="text"
            name="q"
            placeholder="Find a study..."
            value={q}
            onChange={this.handleChange}
          />
        </div>
        <div className="mdc-list">
          {studyEdges.map((edge) => (
            <Edge key={get(edge, "node.id", "")} edge={edge} render={({node}) =>
              <StudyLink withOwner className="mdc-list-item" study={node} />}
            />
          ))}
        </div>
        {this._hasMore() &&
        <button
          className="mdc-button mdc-list-item w-100"
          onClick={this._loadMore}
        >
          Load more
        </button>}
      </div>
    )
  }
}

export default createRefetchContainer(SearchViewerStudies,
  {
    query: graphql`
      fragment SearchViewerStudies_query on Query
      @argumentDefinitions(count: {type: "Int!"}, after: {type: "String"}, query: {type: "String!"}) {
        search(first: $count, after: $after, query: $query, type: STUDY)
        @connection(key: "SearchViewerStudies_search", filters: []) {
          edges {
            cursor
            node {
              id
              ...on Study {
                ...StudyLink_study
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
  },
  graphql`
    query SearchViewerStudiesRefetchQuery ($count: Int!, $after: String, $query: String!) {
      ...SearchViewerStudies_query @arguments(count: $count, after: $after, query: $query)
    }
  `,
)
