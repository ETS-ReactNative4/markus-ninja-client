import * as React from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import SearchBarInput from './SearchBarInput'

const SearchBarQuery = graphql`
  query SearchBarQuery(
    $count: Int!,
    $query: String!,
    $skip: Boolean!
  ){
    ...SearchBarInput_query
  }
`

class SearchBar extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={SearchBarQuery}
        variables={{
          count: 0,
          query: "*",
          type: "STUDY",
          skip: true,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className="SearchBar relative ml3">
                <SearchBarInput query={props} />
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(SearchBar)
