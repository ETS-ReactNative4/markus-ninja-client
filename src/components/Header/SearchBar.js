import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
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
  get classes() {
    const {className} = this.props
    return cls("SearchBar", className)
  }

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
          }
          return (
            <div className={this.classes}>
              <SearchBarInput query={props} />
            </div>
          )
        }}
      />
    )
  }
}

export default withRouter(SearchBar)
