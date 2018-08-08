import React, {Component} from 'react'
import {
  QueryRenderer,
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import environment from 'Environment'
import SearchResultItemPreview from 'components/SearchResultItemPreview'
import Counter from 'components/Counter'
import { get } from 'utils'

import { SEARCH_RESULTS_PER_PAGE } from 'consts'

const StudySearchQuery = graphql`
  query StudySearchQuery(
    $count: Int!,
    $after: String,
    $orderBy: SearchOrder,
    $query: String!,
    $type: SearchType!,
    $within: ID!,
  ) {
    search(first: $count, after: $after, orderBy: $orderBy, query: $query, type: $type, within: $within) {
      edges {
        node {
          __typename
          id
          ...on Lesson {
            ...LessonPreview_lesson
          }
          ...on UserAsset {
            ...UserAssetPreview_asset
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      lessonCount
      userAssetCount
    }
  }
`

class StudySearch extends Component {
  render() {
    const searchQuery = queryString.parse(get(this.props, "location.search", ""))
    const query = get(searchQuery, "q", "*")
    const type = get(searchQuery, "type", "lesson").toUpperCase()

    const direction = get(searchQuery, "o", "desc").toUpperCase()
    const field = (() => {
      switch (get(searchQuery, "s", "").toLowerCase()) {
        case "created":
          return "CREATED_AT"
        case "comments":
          return "COMMENT_COUNT"
        case "updated":
          return "UPDATED_AT"
        default:
          return "BEST_MATCH"
      }
    })()
    const orderBy = {
      direction,
      field,
    }
    return (
      <QueryRenderer
        environment={environment}
        query={StudySearchQuery}
        variables={{
          count: SEARCH_RESULTS_PER_PAGE,
          orderBy,
          query,
          type,
          within: get(this.props, "study.id", ""),
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const pathname = get(props, "location.pathname")
            const search = get(props, "search", {})
            const searchEdges = get(props, "search.edges", [])
            searchQuery.type = "lesson"
            const searchLessons = queryString.stringify(searchQuery)
            searchQuery.type = "user_asset"
            const searchAssets = queryString.stringify(searchQuery)
            return (
              <div>
                <nav>
                  <Link to={{pathname, search: searchLessons}}>
                    Lessons
                    <Counter>{search.lessonCount}</Counter>
                  </Link>
                  <Link to={{pathname, search: searchAssets}}>
                    Assets
                    <Counter>{search.userAssetCount}</Counter>
                  </Link>
                </nav>
                {searchEdges.map(({node}) => (
                  <SearchResultItemPreview key={node.id} item={node} />
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

export default withRouter(createFragmentContainer(StudySearch, graphql`
  fragment StudySearch_study on Study {
    id
    nameWithOwner
    resourcePath
  }
`))
