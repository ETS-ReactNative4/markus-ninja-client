import React, { Component } from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { Route, Switch } from 'react-router-dom'

import PrivateRoute from 'components/PrivateRoute'
import Header from 'components/Header'

import CreateStudyPage from 'containers/CreateStudyPage'
import CoursePage from 'containers/CoursePage'
import LoginPage from 'containers/LoginPage'
import LogoutPage from 'containers/LogoutPage'
import NotificationsPage from 'containers/NotificationsPage'
import UserSettingsPage from 'containers/UserSettingsPage'
import ResearchPage from 'containers/ResearchPage'
import SearchPage from 'containers/SearchPage'
import SignupPage from 'containers/SignupPage'
import StudyPage from 'containers/StudyPage'
import StudySearchPage from 'containers/StudySearchPage'
import TopicPage from 'containers/TopicPage'
import HomePage from 'containers/HomePage'
import UserPage from 'containers/UserPage'
import NotFound from 'components/NotFound'
import environment from 'Environment'

import './styles.css'

const AppQuery = graphql`
  query AppQuery {
    viewer {
      id
      ...Header_viewer
      ...HomePage_viewer
      ...CreateStudyPage_user
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
              <div className="App mdc-typography">
                <Switch>
                  <Route exact path="/login" component={LoginPage} />
                  <Route exact path="/logout" component={LogoutPage} />
                  <Route render={() =>
                    <div>
                      <Header viewer={props.viewer} />
                      <div className="mdc-top-app-bar--fixed-adjust mdc-theme--text-primary-on-light">
                        <div className="rn-page">
                          <Switch>
                            <Route exact path="/" render={(routeProps) => <HomePage viewer={props.viewer} {...routeProps} />} />
                            <PrivateRoute
                              exact
                              path="/new"
                              render={(routeProps) => <CreateStudyPage user={props.viewer} {...routeProps} />}
                            />
                            <PrivateRoute path="/notifications" component={NotificationsPage} />
                            <Route exact path="/research" component={ResearchPage} />
                            <Route exact path="/search" component={SearchPage} />
                            <PrivateRoute path="/settings" component={UserSettingsPage} />
                            <Route exact path="/signup" component={SignupPage} />
                            <Route exact path="/topics/:name" component={TopicPage} />
                            <Route exact path="/:owner/:name/search" component={StudySearchPage} />
                            <Route exact path="/:login" component={UserPage} />
                            <Route
                              exact
                              path="/:owner/:name/course/:number"
                              component={CoursePage}
                            />
                            <Route path="/:owner/:name" component={StudyPage} />
                            <Route component={NotFound} />
                          </Switch>
                        </div>
                      </div>
                    </div>}
                  />
                </Switch>
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
