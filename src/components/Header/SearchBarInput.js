import * as React from 'react'
import {
  createRefetchContainer,
  graphql,
} from 'react-relay'
import { Route, Link } from 'react-router-dom'
import cls from 'classnames'
import queryString from 'query-string'
import SearchResultItemPreview from 'components/SearchResultItemPreview'
import Edge from 'components/Edge'
import { debounce, get, isNil, isEmpty } from 'utils'
import { SEARCH_BAR_RESULTS_PER_PAGE } from 'consts'

class SearchBarInput extends React.Component {
  state = {
    error: null,
    loading: false,
    q: "",
    open: false,
    skip: true,
    type: "study",
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.skip && !this.state.skip) {
      this._refetch(this.state.q)
    }
  }

  render() {
    const { q, loading, open, type } = this.state
    const searchEdges = get(this.props, "query.search.edges", [])
    return (
      <div className={cls("SearchBarInput", {open})}>
        <form action="/search" acceptCharset="utf8" method="get">
          <input
            id="search-query"
            autoComplete="off"
            className="form-control"
            type="text"
            name="q"
            placeholder="Search..."
            value={q}
            onChange={this.handleChange}
            onFocus={() => this.setState({ open: true, skip: false })}
            onBlur={() => this.setState({ open: false })}
          />
          <input
            name="type"
            type="hidden"
            value={type}
          />
        </form>
        <div className="SearchBarInput__results">
          {loading && searchEdges.length < 1
          ? <ul><li>Loading...</li></ul>
          : <ul>
              <Route path="/:owner/:name" render={({ match }) =>
                <li className="SearchBarInput__item">
                  <Link
                    to={{
                      pathname: match.url + "/search",
                      search: queryString.stringify({ q }),
                    }}
                  >
                    Search this study...
                  </Link>
                </li>}
              />
              {searchEdges.map((edge) =>
                <Edge key={get(edge, "node.id", "")} edge={edge} render={({ node }) =>
                  <li className="SearchBarInput__item">
                    <SearchResultItemPreview item={node} />
                  </li>
                }/>
              )}
            </ul>}
        </div>
      </div>
    )
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
        type: this.state.type.toUpperCase(),
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

}

export default createRefetchContainer(SearchBarInput,
  {
    query: graphql`
      fragment SearchBarInput_query on Query {
        search(first: $count, query: $query, type: $type)
          @skip(if: $skip)
          @connection(key:"SearchBarInput_search", filters: []) {
          edges {
            node {
              __typename
              id
              ...on Course {
                ...CoursePreview_course
              }
              ...on Lesson {
                ...LessonPreview_lesson
              }
              ...on Study {
                ...StudyPreview_study
              }
              ...on Topic {
                ...TopicPreview_topic
              }
              ...on User {
                ...UserPreview_user
              }
              ...on UserAsset {
                ...UserAssetPreview_asset
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
      $type: SearchType!
      $skip: Boolean!
    ) {
      ...SearchBarInput_query
    }
  `,
)
