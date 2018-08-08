import * as React from 'react'
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
import { get } from 'utils'

import { SEARCH_RESULTS_PER_PAGE } from 'consts'

const TopicSearchQuery = graphql`
  query TopicSearchQuery(
    $count: Int!,
    $after: String,
    $orderBy: SearchOrder,
    $within: ID!
    $query: String!,
    $type: SearchType!
  ) {
    search(first: $count, after: $after, orderBy: $orderBy, within: $within, query: $query, type: $type) {
      edges {
        node {
          __typename
          id
          ...on Course {
            ...CoursePreview_course
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
      courseCount
      studyCount
    }
  }
`

class TopicSearch extends React.Component {
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
        case "lessons":
          return "LESSON_COUNT"
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
        query={TopicSearchQuery}
        variables={{
          count: SEARCH_RESULTS_PER_PAGE,
          orderBy,
          query,
          type,
          within: this.props.topic.id,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const pathname = get(props, "location.pathname")
            const search = get(props, "search", {})
            const searchEdges = get(props, "search.edges", [])
            searchQuery.type = "course"
            const searchCourses = queryString.stringify(searchQuery)
            searchQuery.type = "study"
            const searchStudies = queryString.stringify(searchQuery)
            return (
              <div>
                <nav>
                  <Link to={{pathname, search: searchStudies}}>
                    Studies
                    <Counter>{search.studyCount}</Counter>
                  </Link>
                  <Link to={{pathname, search: searchCourses}}>
                    Courses
                    <Counter>{search.courseCount}</Counter>
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

export default withRouter(TopicSearch)
