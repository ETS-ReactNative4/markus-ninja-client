import * as React from 'react'
import PropTypes from 'prop-types'
import {
  createFragmentContainer,
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import SearchStudyRefetchResults from './SearchStudyRefetchResults'
import {get, isEmpty} from 'utils'

import { SEARCH_RESULTS_PER_PAGE } from 'consts'

const SearchStudyRefetchQuery = graphql`
  query SearchStudyRefetchQuery(
    $count: Int!,
    $after: String,
    $query: String!,
    $type: SearchType!,
    $within: ID!
  ) {
    ...SearchStudyRefetchResults_results @arguments(count: $count, after: $after, query: $query, type: $type, within: $within)
  }
`

class SearchStudyRefetch extends React.Component {
  constructor(props) {
    super(props)

    this._query = this.props.query
  }

  render() {
    const studyId = get(this.props, "study.id", "")
    const initialQuery = isEmpty(this._query) ? "*" : this._query

    return (
      <QueryRenderer
        environment={environment}
        query={SearchStudyRefetchQuery}
        variables={{
          count: SEARCH_RESULTS_PER_PAGE,
          query: initialQuery,
          type: this.props.type,
          within: studyId,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const {children, query, type} = this.props

            return (
              <div className="SearchStudyRefetch">
                <SearchStudyRefetchResults
                  query={query}
                  results={props}
                  type={type}
                  studyId={studyId}
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

SearchStudyRefetch.propTypes = {
  query: PropTypes.string.isRequired,
}

SearchStudyRefetch.defaultProps = {
  query: "",
}

export default withRouter(createFragmentContainer(SearchStudyRefetch, graphql`
  fragment SearchStudyRefetch_study on Study {
    id
  }
`))
