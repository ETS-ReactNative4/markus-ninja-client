import * as React from 'react'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import AppContainer from './AppContainer'
import {get} from 'utils'

const AppQuery = graphql`
  query AppQuery {
    viewer {
      ...AppContainer_viewer
    }
  }
`

class App extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={AppQuery}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const viewer = get(props, "viewer", null)
            return <AppContainer viewer={viewer} />
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default App
