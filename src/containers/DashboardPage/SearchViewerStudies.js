import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import StudyLink from 'components/StudyLink.js'
import SearchUserStudiesInput from 'components/SearchUserStudiesInput'
import { debounce, get, isNil, isEmpty } from 'utils'
import { SEARCH_BAR_RESULTS_PER_PAGE } from 'consts'

class SearchViewerStudies extends React.Component {
  state = {
    error: null,
    loading: false,
    q: "",
    studyEdges: [],
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
        within: get(this.props, "viewer.id"),
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
    const {studyEdges} = this.state

    return (
      <div className="SearchViewerStudies mdc-list mdc-list--non-interactive">
        <div role="separator" className="mdc-list-divider"></div>
        <div className="mdc-list-item">
          <div className="flex justify-between items-center w-100">
            <span className="mdc-typography--subtitle1">Studies</span>
            <Link className="mdc-button mdc-button--unelevated" to="/new">New</Link>
          </div>
        </div>
        <div className="mdc-list-item">
          <SearchUserStudiesInput
            query={this.props.query}
            user={get(this.props, "viewer", null)}
            onQueryComplete={(studyEdges) => this.setState({ studyEdges })}
          />
        </div>
        <div className="mdc-list">
          {studyEdges.map((edge) => (
            edge
            ? <StudyLink
                key={get(edge, "node.id", "")}
                withOwner
                className="mdc-list-item"
                study={get(edge, "node", null)}
              />
            : null
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

export default createFragmentContainer(SearchViewerStudies, graphql`
  fragment SearchViewerStudies_viewer on User {
    ...SearchUserStudiesInput_user
  }
`)
