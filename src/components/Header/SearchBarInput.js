import * as React from 'react'
import {
  createRefetchContainer,
  graphql,
} from 'react-relay'
import { Route, Link } from 'react-router-dom'
import queryString from 'query-string'
import SearchResultItemPreview from 'components/SearchResultItemPreview'
import Edge from 'components/Edge'
import { debounce, get, isEmpty } from 'utils'
import { SEARCH_BAR_RESULTS_PER_PAGE } from 'consts'

class SearchBarInput extends React.Component {
  state = {
    error: null,
    q: "",
    type: "study",
  }

  render() {
    const { q, type } = this.state
    const searchEdges = get(this.props, "query.search.edges", [])
    return (
      <div className="SearchBarInput">
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
          />
          <input
            name="type"
            type="hidden"
            value={type}
          />
        </form>
        <ul className="SearchBarInput__results">
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
        </ul>
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
    this.props.relay.refetch(
      {
        count: SEARCH_BAR_RESULTS_PER_PAGE,
        query: isEmpty(query) ? "*" : query,
        type: this.state.type.toUpperCase(),
      },
      null,
      null,
      {force: true},
    )
  }, 300)

}

export default createRefetchContainer(SearchBarInput,
  {
    query: graphql`
      fragment SearchBarInput_query on Query {
        search(first: $count, query: $query, type: $type)
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
    ) {
      ...SearchBarInput_query
    }
  `,
)
