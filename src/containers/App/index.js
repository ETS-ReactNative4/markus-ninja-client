import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'

import environment from 'Environment'
import PrivateRoute from 'components/PrivateRoute'

import CreateStudyPage from 'containers/CreateStudyPage'
import Header from 'components/Header'
import LoginPage from 'containers/LoginPage'
import LogoutPage from 'containers/LogoutPage'
import UserSettingsPage from 'containers/UserSettingsPage'
import SearchPage from 'containers/SearchPage'
import SignupPage from 'containers/SignupPage'
import StudyPage from 'containers/StudyPage'
import ViewerStudiesPage from 'containers/ViewerStudiesPage'
import UserPage from 'containers/UserPage'

const AppQuery = graphql`
  query AppQuery {
    viewer {
      ...Header_viewer
    }
  }
`

class App extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={AppQuery}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className="App">
                <Header viewer={props.viewer}/>
                <div className="App__content">
                  <Switch>
                    <Route exact path="/" component={ViewerStudiesPage} />
                    <Route exact path="/new" component={CreateStudyPage} />
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/logout" component={LogoutPage} />
                    <Route exact path="/search" component={SearchPage} />
                    <Route exact path="/signup" component={SignupPage} />
                    <PrivateRoute path="/settings" component={UserSettingsPage} />
                    <Route exact path="/:login" component={UserPage} />
                    <Route path="/:owner/:name" component={StudyPage} />
                  </Switch>
                </div>
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default App
