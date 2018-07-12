import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import CreateStudyPage from 'containers/CreateStudyPage'
import Header from 'components/Header'
import LoginFormPage from 'containers/LoginFormPage'
import StudyPage from 'containers/StudyPage'
import StudyListPage from 'containers/StudyListPage'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="App__content">
          <Switch>
            <Route exact path="/" component={StudyListPage} />
            <Route exact path="/new" component={CreateStudyPage} />
            <Route exact path="/login" component={LoginFormPage} />
            <Route path="/:owner/:name" component={StudyPage} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App
