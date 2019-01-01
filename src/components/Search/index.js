import * as React from 'react'
import PropTypes from 'prop-types'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { withRouter } from 'react-router'
import environment from 'Environment'
import SearchContainer, {SearchProp, SearchPropDefaults} from './SearchContainer'
import {isEmpty} from 'utils'

import { SEARCH_RESULTS_PER_PAGE } from 'consts'

const SearchQuery = graphql`
  query SearchQuery(
    $count: Int!,
    $after: String,
    $orderBy: SearchOrder,
    $query: String!,
    $type: SearchType!,
    $styleCard: Boolean!,
    $styleList: Boolean!,
    $styleSelect: Boolean!,
  ) {
    ...SearchContainer_results @arguments(
      count: $count,
      after: $after,
      orderBy: $orderBy,
      query: $query,
      type: $type,
      styleCard: $styleCard,
      styleList: $styleList,
      styleSelect: $styleSelect,
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
    const {count, fragment} = this.props

    return (
      <QueryRenderer
        environment={environment}
        query={SearchQuery}
        variables={{
          count,
          query,
          type,
          orderBy,
          styleCard: fragment === "card",
          styleList: fragment === "list",
          styleSelect: fragment === "select",
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const {children, orderBy, query, type} = this.props

            return (
              <SearchContainer
                count={count}
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
  count: PropTypes.number,
  orderBy: PropTypes.shape({
    direction: PropTypes.string,
    field: PropTypes.string,
  }),
  query: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  fragment: PropTypes.oneOf(["card", "list", "select"]).isRequired,
}

Search.defaultProps = {
  count: SEARCH_RESULTS_PER_PAGE,
  query: "*",
}

export {SearchProp, SearchPropDefaults}
export default withRouter(Search)
