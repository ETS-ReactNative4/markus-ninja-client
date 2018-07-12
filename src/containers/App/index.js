import React, { Component } from 'react';
import LoginFormPage from 'containers/LoginFormPage'
import StudyListPage from 'containers/StudyListPage'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <LoginFormPage />
        <StudyListPage />
      </div>
    );
  }
}

export default App;
