import * as React from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import SearchBarResults from './SearchBarResults'

const SearchBarQuery = graphql`
  query SearchBarQuery(
    $count: Int!,
    $query: String!,
    $type: SearchType!
  ){
    ...SearchBarResults_data
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
          type: "STUDY"
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className="SearchBar">
                <SearchBarResults data={props} />
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
