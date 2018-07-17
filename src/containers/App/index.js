import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import CreateStudyPage from 'containers/CreateStudyPage'
import Header from 'components/Header'
import LoginPage from 'containers/LoginPage'
import UserSettingsPage from 'containers/UserSettingsPage'
import SignupPage from 'containers/SignupPage'
import StudyPage from 'containers/StudyPage'
import ViewerStudiesPage from 'containers/ViewerStudiesPage'
import UserPage from 'containers/UserPage'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="App__content">
          <Switch>
            <Route exact path="/" component={ViewerStudiesPage} />
            <Route exact path="/new" component={CreateStudyPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/signup" component={SignupPage} />
            <Route path="/settings" component={UserSettingsPage} />
            <Route exact path="/:login" component={UserPage} />
            <Route path="/:owner/:name" component={StudyPage} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App
