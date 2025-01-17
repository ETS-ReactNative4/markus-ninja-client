import * as React from 'react'
import {
  createRefetchContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {Helmet} from 'react-helmet'
import {Redirect, Route, Switch, withRouter} from 'react-router-dom'
import isEqual from 'lodash.isequal'

import PrivateRoute from 'components/PrivateRoute'
import Header from 'components/Header'
import NotFound from 'components/NotFound'

import ActivityPage from 'containers/ActivityPage'
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

  componentDidMount() {
    window.addEventListener('click', this.offsetAnchor)
  }

  // NOTE: this is needed, because relay's refetch doesn't call callback
  // sometimes
  componentDidUpdate(prevProps, prevState) {
    const {
      isLoadingViewer: wasLoadingViewer,
      viewer: oldViewer,
    } = prevState
    const {viewer} = this.props
    if (wasLoadingViewer && !isEqual(oldViewer, viewer)) {
      this.setState({
        isLoadingViewer: false,
        viewer,
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.offsetAnchor)
  }

  // Offset anchor hash links scroll position to be slightly above the element.
  // This is needed so the element is hidden under the top app bar.
  offsetAnchor = (e) => {
    e = e || window.event
    const t = e.target || e.srcElement
    if (t.href && t.hash.length !== 0) {
      e.preventDefault()
      const el = document.getElementById(t.hash.slice(1))
      if (el) {
        const rect = el.getBoundingClientRect()
        window.scrollTo(rect.left + window.pageXOffset, rect.top + window.pageYOffset - 200)
      }
      return false
    }
  }

  refetch_ = () => {
    this.setState({
      isLoadingViewer: true,
      viewer: null,
    })
    return new Promise((resolve, reject) => {
      this.props.relay.refetch(
        null,
        null,
        (error) => {
          if (error) {
            console.log(error)
            reject(error)
          }
          this.setState({
            isLoadingViewer: false,
            viewer: this.props.viewer,
          })
          resolve()
        },
        {force: true},
      )
      // NOTE: this is needed, because relay's refetch doesn't call callback
      // sometimes
      setTimeout(() => {
        let timerId = setInterval(() => {
          if (!this.state.isLoadingViewer) {
            clearInterval(timerId)
            resolve()
          }
        }, 10)
      }, 10)
    })
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
          <Helmet>
            <title>Markus the ninja!</title>
          </Helmet>
          <Switch>
            <Route
              exact
              path="/signin"
              component={LoginPage}
            />
            <Route
              exact
              path="/signout"
              component={LogoutPage}
            />
            <Route exact path="/reset_password" component={ResetPasswordPage} />
            <Route
              exact
              path="/signup"
              component={SignupPage}
            />
            <PrivateRoute
              exact
              path="/verify_email"
              render={(routeProps) => <VerifyEmailPage viewer={viewer} {...routeProps} />}
            />
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
                      <Route exact path="/u/:login" component={UserPage} />
                      <Route
                        path="/u/:owner/:name/activity/:number"
                        component={ActivityPage}
                      />
                      <Route
                        path="/u/:owner/:name/asset/:filename"
                        component={UserAssetPage}
                      />
                      <Route
                        path="/u/:owner/:name/course/:number"
                        component={CoursePage}
                      />
                      <Route
                        path="/u/:owner/:name/lesson/:number"
                        component={LessonPage}
                      />
                      <Route path="/u/:owner/:name" component={StudyPage} />
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
