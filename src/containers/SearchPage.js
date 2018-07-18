import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import environment from 'Environment'
import SearchResultItemPreview from 'components/SearchResultItemPreview'
import { get } from 'utils'

import { SEARCH_RESULTS_PER_PAGE } from 'consts'

const SearchPageQuery = graphql`
  query SearchPageQuery(
    $count: Int!,
    $after: String,
    $query: String!,
    $type: SearchType!
  ) {
    search(first: $count, after: $after, query: $query, type: $type) {
      edges {
        node {
          ...on Lesson {
            ...LessonPreview_lesson
          }
          ...on Study {
            ...StudyPreview_study
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

class SearchPage extends Component {
  render() {
    const search = queryString.parse(get(this.props, "location.search", ""))
    const query = get(search, "q", null)
    const type = get(search, "type", null)
    return (
      <QueryRenderer
        environment={environment}
        query={SearchPageQuery}
        variables={{
          count: SEARCH_RESULTS_PER_PAGE,
          query,
          type,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const searchEdges = get(props, "user.search.edges", [])
            return (
              <div>
                {searchEdges.map(({node}) => (
                  <SearchResultItemPreview key={node.__id} item={node} />
                ))}
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(SearchPage)
