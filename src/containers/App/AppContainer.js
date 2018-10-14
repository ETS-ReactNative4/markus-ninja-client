import * as React from 'react'
import {
  createRefetchContainer,
  graphql,
} from 'react-relay'
import {Redirect, Route, Switch, withRouter} from 'react-router-dom'

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

import {get, isNil} from 'utils'

import './styles.css'

class AppContainer extends React.Component {
  state = {
    authenticated: !isNil(this.props.viewer),
    loading: false,
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.authenticated && this.state.authenticated) {
      this._refetch()
    }
  }

  _refetch = () => {
    this.setState({
      loading: true,
    })
    this.props.relay.refetch(
      null,
      null,
      (error) => {
        if (!isNil(error)) {
          console.log(error)
        }
        this.setState({
          loading: false
        })
      },
      {force: true},
    )
  }

  get viewerNeedsVerification() {
    const {authenticated} = this.state
    const {viewer} = this.props
    return !isNil(viewer) &&
      !get(viewer, "isVerified", false) &&
      authenticated
  }

  render() {
    const viewer = get(this.props, "viewer", null)
    const authenticated = !isNil(viewer)

    return (
      <div className="AppContainer mdc-typography">
        <Switch>
          <Route
            exact
            path="/login"
            render={() => <LoginPage onLogin={() => this.setState({authenticated: true})} />}
          />
          <Route
            exact
            path="/logout"
            render={() => <LogoutPage onLogout={() => this.setState({authenticated: false})} />}
          />
          <Route exact path="/reset_password" component={ResetPasswordPage} />
          <Route
            exact
            path="/signup"
            render={() => <SignupPage onLogin={() => this.setState({authenticated: true})} />}
          />
          <Route exact path="/verify_email" component={VerifyEmailPage} />
          <Route render={() => {
            if (this.viewerNeedsVerification) {
              return <Redirect to="/verify_email" />
            }

            return (
              <React.Fragment>
                <Header viewer={viewer} />
                <div className="mdc-top-app-bar--fixed-adjust">
                  <Switch>
                    <Route
                      exact
                      path="/"
                      render={(routeProps) => <HomePage viewer={viewer} {...routeProps} />}
                    />
                    <PrivateRoute
                      exact
                      path="/new"
                      authenticated={authenticated}
                      render={(routeProps) => <CreateStudyPage user={viewer} {...routeProps} />}
                    />
                    <PrivateRoute
                      path="/enrolled"
                      authenticated={authenticated}
                      component={EnrolledStudiesPage}
                    />
                    <PrivateRoute
                      path="/notifications"
                      authenticated={authenticated}
                      component={NotificationsPage}
                    />
                    <Route exact path="/research" component={ResearchPage} />
                    <Route exact path="/search" component={SearchPage} />
                    <PrivateRoute
                      path="/settings"
                      authenticated={authenticated}
                      component={UserSettingsPage}
                    />
                    <Route exact path="/topics" component={TopicsPage} />
                    <Route exact path="/topics/:name" component={TopicPage} />
                    <Route exact path="/:login" component={UserPage} />
                    <Route
                      path="/:owner/:name/asset/:filename"
                      component={UserAssetPage}
                    />
                    <Route
                      path="/:owner/:name/course/:number"
                      component={CoursePage}
                    />
                    <Route
                      path="/:owner/:name/lesson/:number"
                      component={LessonPage}
                    />
                    <Route path="/:owner/:name" component={StudyPage} />
                    <Route component={NotFound} />
                  </Switch>
                </div>
              </React.Fragment>
            )
          }}/>
        </Switch>
      </div>
    )
  }
}

export default withRouter(createRefetchContainer(AppContainer,
  {
    viewer: graphql`
      fragment AppContainer_viewer on User {
        id
        isVerified
        ...Header_viewer
        ...CreateStudyPage_user
      }
    `,
  },
  graphql`
    query AppContainerRefetchQuery {
      viewer {
        ...AppContainer_viewer
      }
    }
  `,
))
