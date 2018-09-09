import * as React from 'react'
import {
  createFragmentContainer,
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import SearchStudyRefetchResults from './SearchStudyRefetchResults'
import { get } from 'utils'

import { SEARCH_RESULTS_PER_PAGE } from 'consts'

const SearchStudyRefetchQuery = graphql`
  query SearchStudyRefetchQuery(
    $count: Int!,
    $after: String,
    $query: String!,
    $type: SearchType!,
    $within: ID!
  ) {
    ...SearchStudyRefetchResults_query @arguments(count: $count, after: $after, query: $query, type: $type, within: $within)
  }
`

class SearchStudyRefetch extends React.Component {
  render() {
    const {children, query, type, study} = this.props
    const studyId = get(this.props, "study.id", "")

    return (
      <QueryRenderer
        environment={environment}
        query={SearchStudyRefetchQuery}
        variables={{
          count: SEARCH_RESULTS_PER_PAGE,
          query,
          type,
          within: studyId,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className="SearchStudyRefetch">
                <SearchStudyRefetchResults
                  query={props}
                  type={type}
                  studyId={study.id}
                >
                  {children}
                </SearchStudyRefetchResults>
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(createFragmentContainer(SearchStudyRefetch, graphql`
  fragment SearchStudyRefetch_study on Study {
    id
  }
`))
