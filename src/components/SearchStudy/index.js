import * as React from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import environment from 'Environment'
import SearchStudyResults from './SearchStudyResults'
import { get } from 'utils'

import { SEARCH_RESULTS_PER_PAGE } from 'consts'

const SearchStudyQuery = graphql`
  query SearchStudyQuery(
    $count: Int!,
    $after: String,
    $query: String!,
    $type: SearchType!,
  ) {
    ...SearchStudyResults_query @arguments(count: $count, after: $after, query: $query, type: $type)
  }
`

class SearchStudy extends React.Component {
  render() {
    const searchQuery = queryString.parse(get(this.props, "location.search", ""))
    const query = get(searchQuery, "q", "*")

    return (
      <QueryRenderer
        environment={environment}
        query={SearchStudyQuery}
        variables={{
          count: SEARCH_RESULTS_PER_PAGE,
          query,
          type: this.props.type,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className="SearchStudy">
                <SearchStudyResults
                  query={props}
                  type={this.props.type}
                >
                  {this.props.children}
                </SearchStudyResults>
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(SearchStudy)
