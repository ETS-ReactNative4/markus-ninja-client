import React, {Component} from 'react'
import {
  createFragmentContainer,
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import environment from 'Environment'
import SearchStudyLabels from 'components/SearchStudyLabels'
import { get } from 'utils'

import { SEARCH_RESULTS_PER_PAGE } from 'consts'

const SearchStudyLabelsPageQuery = graphql`
  query SearchStudyLabelsPageQuery(
    $count: Int!,
    $after: String,
    $query: String!,
    $within: ID!
  ) {
    ...SearchStudyLabels_query
  }
`

class SearchStudyLabelsPage extends Component {
  render() {
    const searchQuery = queryString.parse(get(this.props, "location.search", ""))
    const query = get(searchQuery, "q", "*")

    return (
      <QueryRenderer
        environment={environment}
        query={SearchStudyLabelsPageQuery}
        variables={{
          count: SEARCH_RESULTS_PER_PAGE,
          query,
          within: this.props.study.id,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className="SearchStudyLabelsPage">
                <SearchStudyLabels query={props} studyId={this.props.study.id} />
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(createFragmentContainer(SearchStudyLabelsPage, graphql`
  fragment SearchStudyLabelsPage_study on Study {
    id
  }
`))
