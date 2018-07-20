import * as React from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import SearchBarResults from './SearchBarResults'

const SearchBarQuery = graphql`
  query SearchBarQuery(
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

export default SearchBar
