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
import {get} from 'utils'

import Context from './Context'

import './styles.css'

class AppContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isAuthenticated: () => Boolean(this.state.viewer),
      isLoadingViewer: false,
      refetchViewer: this.refetch_,
      removeViewer: () => this.setState({viewer: null}),
      viewer: this.props.viewer,
    }
  }

  // NOTE: this is needed, because relay's refetch doesn't call callback
  // sometimes
  componentDidUpdate(prevProps, prevState) {
    const {
      isLoadingViewer: wasLoadingViewer,
      viewer: oldViewer,
    } = prevState
    const {viewer} = this.props
    if (wasLoadingViewer && !oldViewer && viewer) {
      this.setState({
        isLoadingViewer: false,
        viewer,
      })
    }
  }

  refetch_ = () => {
    this.setState({
      isLoadingViewer: true,
      viewer: null,
    })
    this.props.relay.refetch(
      null,
      null,
      (error) => {
        if (error) {
          console.log(error)
          return
        }
        this.setState({
          isLoadingViewer: false,
          viewer: this.props.viewer,
        })
      },
      {force: true},
    )
    return Promise.resolve()
  }

  get viewerNeedsVerification() {
    const {viewer} = this.state
    return viewer && !viewer.isVerified
  }

  render() {
    const viewer = get(this.props, "viewer", null)

    if (this.state.isLoadingViewer) {
      return <div>Loading...</div>
    }

    return (
      <Context.Provider value={this.state}>
        <div className="AppContainer mdc-typography">
          <Switch>
            <Route
              exact
              path="/signin"
              component={LoginPage}
            />
            <Route
              exact
              path="/logout"
              component={LogoutPage}
            />
            <Route exact path="/reset_password" component={ResetPasswordPage} />
            <Route
              exact
              path="/signup"
              component={SignupPage}
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
                        component={HomePage}
                      />
                      <PrivateRoute
                        exact
                        path="/new"
                        render={(routeProps) => <CreateStudyPage user={viewer} {...routeProps} />}
                      />
                      <PrivateRoute
                        path="/(enrolled|notifications)"
                        component={NotificationsPage}
                      />
                      <Route exact path="/research" component={ResearchPage} />
                      <Route exact path="/search" component={SearchPage} />
                      <PrivateRoute
                        path="/settings"
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
      </Context.Provider>
    )
  }
}

AppContainer.contextType = Context

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
