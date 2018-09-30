import * as React from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import AppContainer from './AppContainer'
import {get} from 'utils'

const AppQuery = graphql`
  query AppQuery($skip: Boolean!) {
    viewer @skip(if: $skip) {
      ...AppContainer_viewer
    }
  }
`

class App extends React.Component {
  render() {
    const {authenticated} = this.props

    return (
      <QueryRenderer
        environment={environment}
        query={AppQuery}
        variables={{
          skip: !authenticated,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const viewer = get(props, "viewer", null)
            return <AppContainer authenticated={authenticated} viewer={viewer} />
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default App
