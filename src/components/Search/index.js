import * as React from 'react'
import PropTypes from 'prop-types'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import SearchResults, {SearchResultsProp, SearchResultsPropDefaults} from './SearchResults'
import {isEmpty} from 'utils'

import { SEARCH_RESULTS_PER_PAGE } from 'consts'

const SearchQuery = graphql`
  query SearchQuery(
    $count: Int!,
    $after: String,
    $orderBy: SearchOrder,
    $query: String!,
    $type: SearchType!,
    $within: ID,
  ) {
    ...SearchResults_results @arguments(
      count: $count,
      after: $after,
      orderBy: $orderBy,
      query: $query,
      type: $type,
      within: $within,
    )
  }
`

class Search extends React.Component {
  constructor(props) {
    super(props)

    const {query, type} = this.props

    this.state = {
      query,
      type,
    }
  }

  componentDidUpdate(prevProps) {
    const {query, type} = this.props
    if (prevProps.type !== type) {
      this.setState({query, type})
    }
  }

  render() {
    const {within} = this.props
    const {type} = this.state
    const initialQuery = isEmpty(this.state.query) ? "*" : this.state.query

    return (
      <QueryRenderer
        environment={environment}
        query={SearchQuery}
        variables={{
          count: SEARCH_RESULTS_PER_PAGE,
          query: initialQuery,
          type,
          within,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const {children, orderBy, query, type} = this.props

            return (
              <div className="Search">
                <SearchResults
                  orderBy={orderBy}
                  query={query}
                  results={props}
                  type={type}
                  within={within}
                >
                  {children}
                </SearchResults>
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

Search.propTypes = {
  orderBy: PropTypes.shape({
    direction: PropTypes.string,
    field: PropTypes.string,
  }),
  query: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  within: PropTypes.string,
}

Search.defaultProps = {
  query: "",
  type: "",
}

export {SearchResultsProp, SearchResultsPropDefaults}
export default withRouter(Search)
