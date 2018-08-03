import * as React from 'react'
import {
  createRefetchContainer,
  graphql,
} from 'react-relay'
import { Route, Link } from 'react-router-dom'
import queryString from 'query-string'
import SearchResultItemPreview from 'components/SearchResultItemPreview'
import { debounce, get, isEmpty, isNil } from 'utils'

class SearchBarResults extends React.Component {
  state = {
    error: null,
    q: "",
    type: "study",
  }

  render() {
    const { q, type } = this.state
    const searchEdges = get(this.props, "data.search.edges", [])
    return (
      <div className="SearchBarResults">
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
        <ul className="SearchBarResults__results">
          <Route path="/:owner/:name" render={({ match }) =>
            <li className="SearchBarResults__item">
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
          {searchEdges.map(({node}) => {
            if (!isNil(node)) {
              return (
                <li key={node.id} className="SearchBarResults__item">
                  <SearchResultItemPreview item={node} />
                </li>
              )
            }
            return null
          })}
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
        query: isEmpty(query) ? "*" : query,
        type: this.state.type.toUpperCase(),
      },
      null,
      null,
      {force: true},
    )
  }, 300)

}

export default createRefetchContainer(SearchBarResults,
  {
    data: graphql`
      fragment SearchBarResults_data on Query {
        search(first: 7, query: $query, type: $type)
          @connection(key:"SearchBarResults_search", filters: []) {
          edges {
            node {
              __typename
              id
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
    query SearchBarResultsRefetchQuery(
      $query: String!,
      $type: SearchType!
    ) {
      ...SearchBarResults_data
    }
  `,
)
