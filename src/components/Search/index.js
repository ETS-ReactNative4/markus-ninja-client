import * as React from 'react'
import PropTypes from 'prop-types'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import SearchContainer, {SearchProp, SearchPropDefaults} from './SearchContainer'
import {get, isEmpty} from 'utils'

import { SEARCH_RESULTS_PER_PAGE } from 'consts'

const SearchQuery = graphql`
  query SearchQuery(
    $count: Int!,
    $after: String,
    $orderBy: SearchOrder,
    $query: String!,
    $type: SearchType!,
  ) {
    ...SearchContainer_results @arguments(
      count: $count,
      after: $after,
      orderBy: $orderBy,
      query: $query,
      type: $type,
    )
  }
`

class Search extends React.Component {
  constructor(props) {
    super(props)

    const {orderBy, query, type} = this.props

    this.state = {
      orderBy,
      query: isEmpty(query) ? "*" : query,
      type,
    }
  }

  render() {
    const {orderBy, query, type} = this.state

    return (
      <QueryRenderer
        environment={environment}
        query={SearchQuery}
        variables={{
          count: get(this.props, "count", SEARCH_RESULTS_PER_PAGE),
          query,
          type,
          orderBy,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const {children, orderBy, query, type} = this.props

            return (
              <SearchContainer
                orderBy={orderBy}
                query={query}
                results={props}
                type={type}
              >
                {children}
              </SearchContainer>
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
}

Search.defaultProps = {
  query: "",
  type: "",
}

export {SearchProp, SearchPropDefaults}
export default withRouter(Search)
