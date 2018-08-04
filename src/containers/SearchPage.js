import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import environment from 'Environment'
import SearchResultItemPreview from 'components/SearchResultItemPreview'
import Counter from 'components/Counter'
import { get, isEmpty } from 'utils'

import { SEARCH_RESULTS_PER_PAGE } from 'consts'

const SearchPageQuery = graphql`
  query SearchPageQuery(
    $count: Int!,
    $after: String,
    $orderBy: SearchOrder,
    $query: String!,
    $type: SearchType!
  ) {
    search(first: $count, after: $after, orderBy: $orderBy, query: $query, type: $type) {
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
      pageInfo {
        hasNextPage
        endCursor
      }
      lessonCount
      studyCount
      topicCount
      userCount
      userAssetCount
    }
  }
`

class SearchPage extends Component {
  render() {
    const searchQuery = queryString.parse(get(this.props, "location.search", ""))
    const query = get(searchQuery, "q", "*")
    const type = get(searchQuery, "type", "study").toUpperCase()

    const direction = get(searchQuery, "o", "desc").toUpperCase()
    const field = (() => {
      switch (get(searchQuery, "s", "").toLowerCase()) {
        case "advanced":
          return "ADVANCED_AT"
        case "apples":
          return "APPLE_COUNT"
        case "created":
          return "CREATED_AT"
        case "comments":
          return "COMMENT_COUNT"
        case "lessons":
          return "LESSON_COUNT"
        case "studies":
          return "STUDY_COUNT"
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
        query={SearchPageQuery}
        variables={{
          count: SEARCH_RESULTS_PER_PAGE,
          orderBy,
          query,
          type,
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
            searchQuery.type = "study"
            const searchStudies = queryString.stringify(searchQuery)
            searchQuery.type = "topic"
            const searchTopics = queryString.stringify(searchQuery)
            searchQuery.type = "user"
            const searchUsers = queryString.stringify(searchQuery)
            searchQuery.type = "user_asset"
            const searchUserAssets = queryString.stringify(searchQuery)
            return (
              <div className="SearchPage">
                <nav>
                  <Link to={{pathname, search: searchLessons}}>
                    Lessons
                    <Counter>{search.lessonCount}</Counter>
                  </Link>
                  <Link to={{pathname, search: searchStudies}}>
                    Studies
                    <Counter>{search.studyCount}</Counter>
                  </Link>
                  <Link to={{pathname, search: searchTopics}}>
                    Topics
                    <Counter>{search.topicCount}</Counter>
                  </Link>
                  <Link to={{pathname, search: searchUsers}}>
                    Users
                    <Counter>{search.userCount}</Counter>
                  </Link>
                  <Link to={{pathname, search: searchUserAssets}}>
                    UserAssets
                    <Counter>{search.userAssetCount}</Counter>
                  </Link>
                </nav>
                <div className="SearchPage__results">
                  {isEmpty(searchEdges)
                  ? <span>0 results</span>
                  : searchEdges.map(({node}) => (
                      <SearchResultItemPreview key={node.id} item={node} />
                    ))}
                </div>
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
