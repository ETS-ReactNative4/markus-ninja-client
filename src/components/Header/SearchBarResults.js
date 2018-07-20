import * as React from 'react'
import {
  createRefetchContainer,
  graphql,
} from 'react-relay'
import SearchResultItemPreview from 'components/SearchResultItemPreview'
import { debounce, get, isEmpty } from 'utils'

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
        {searchEdges.map(({node}) => (
          <SearchResultItemPreview key={node.id} item={node} />
        ))}
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
        search(first: 7, query: $query, type: $type) {
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
