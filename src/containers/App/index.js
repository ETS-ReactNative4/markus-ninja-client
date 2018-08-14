import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import PrivateRoute from 'components/PrivateRoute'

import CreateStudyPage from 'containers/CreateStudyPage'
import Header from 'components/Header'
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

class App extends Component {
  render() {
    return (
      <div className="App mdc-typography">
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/logout" component={LogoutPage} />
          <Route render={() =>
            <div className="app-content">
              <Header />
              <Switch>
                <Route exact path="/" component={HomePage} />
                <PrivateRoute exact path="/new" component={CreateStudyPage} />
                <PrivateRoute path="/notifications" component={NotificationsPage} />
                <Route exact path="/research" component={ResearchPage} />
                <Route exact path="/search" component={SearchPage} />
                <PrivateRoute path="/settings" component={UserSettingsPage} />
                <Route exact path="/signup" component={SignupPage} />
                <Route exact path="/topics/:name" component={TopicPage} />
                <Route exact path="/:owner/:name/search" component={StudySearchPage} />
                <Route exact path="/:login" component={UserPage} />
                <Route path="/:owner/:name" component={StudyPage} />
                <Route component={NotFound} />
              </Switch>
            </div>}
          />
        </Switch>
      </div>
    )
  }
}

export default App
