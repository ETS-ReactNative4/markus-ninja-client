import * as React from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { Route, Switch } from 'react-router-dom'

import PrivateRoute from 'components/PrivateRoute'
import Header from 'components/Header'
import NotFound from 'components/NotFound'

import CreateStudyPage from 'containers/CreateStudyPage'
import CoursePage from 'containers/CoursePage'
import EnrolledStudiesPage from 'containers/EnrolledStudiesPage'
import LessonPage from 'containers/LessonPage'
import LoginPage from 'containers/LoginPage'
import LogoutPage from 'containers/LogoutPage'
import NotificationsPage from 'containers/NotificationsPage'
import UserSettingsPage from 'containers/UserSettingsPage'
import ResearchPage from 'containers/ResearchPage'
import ResetPasswordPage from 'containers/ResetPasswordPage'
import SearchPage from 'containers/SearchPage'
import SignupPage from 'containers/SignupPage'
import StudyPage from 'containers/StudyPage'
import TopicPage from 'containers/TopicPage'
import TopicsPage from 'containers/TopicsPage'
import HomePage from 'containers/HomePage'
import UserPage from 'containers/UserPage'
import UserAssetPage from 'containers/UserAssetPage'
import VerifyEmailPage from 'containers/VerifyEmailPage'
import environment from 'Environment'

import './styles.css'

const AppQuery = graphql`
  query AppQuery {
    viewer {
      id
      ...Header_viewer
      ...CreateStudyPage_user
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
            return (
              <div className="App mdc-typography">
                <Switch>
                  <Route exact path="/login" component={LoginPage} />
                  <Route exact path="/logout" component={LogoutPage} />
                  <Route exact path="/reset_password" component={ResetPasswordPage} />
                  <Route exact path="/verify_email" component={VerifyEmailPage} />
                  <Route render={() =>
                    <div>
                      <Header viewer={props.viewer} />
                      <div className="mdc-top-app-bar--fixed-adjust mdc-theme--text-primary-on-light">
                        <Switch>
                          <Route exact path="/" component={HomePage} />
                          <PrivateRoute
                            exact
                            path="/new"
                            render={(routeProps) => <CreateStudyPage user={props.viewer} {...routeProps} />}
                          />
                          <PrivateRoute path="/enrolled" component={EnrolledStudiesPage} />
                          <PrivateRoute path="/notifications" component={NotificationsPage} />
                          <Route exact path="/research" component={ResearchPage} />
                          <Route exact path="/search" component={SearchPage} />
                          <PrivateRoute path="/settings" component={UserSettingsPage} />
                          <Route exact path="/signup" component={SignupPage} />
                          <Route exact path="/topics" component={TopicsPage} />
                          <Route exact path="/topics/:name" component={TopicPage} />
                          <Route exact path="/:login" component={UserPage} />
                          <Route
                            exact
                            path="/:owner/:name/asset/:filename"
                            component={UserAssetPage}
                          />
                          <Route
                            exact
                            path="/:owner/:name/course/:number"
                            component={CoursePage}
                          />
                          <Route
                            exact
                            path="/:owner/:name/lesson/:number"
                            component={LessonPage}
                          />
                          <Route path="/:owner/:name" component={StudyPage} />
                          <Route component={NotFound} />
                        </Switch>
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
