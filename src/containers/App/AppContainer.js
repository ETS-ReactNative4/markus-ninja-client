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
import NotificationsPage from 'containers/NotificationsPage'
import UserSettingsPage from 'containers/UserSettingsPage'
import ResearchPage from 'containers/ResearchPage'
import SearchPage from 'containers/SearchPage'
import SignupPage from 'containers/SignupPage'
import StudyPage from 'containers/StudyPage'
import TopicPage from 'containers/TopicPage'
import TopicsPage from 'containers/TopicsPage'
import HomePage from 'containers/HomePage'
import UserPage from 'containers/UserPage'
import UserAssetPage from 'containers/UserAssetPage'

import {get, isNil} from 'utils'

import './styles.css'

class AppContainer extends React.Component {
  state = {
    loading: false,
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.authenticated && this.props.authenticated) {
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
    const {authenticated, viewer} = this.props
    return !isNil(viewer) &&
      !get(viewer, "isVerified", false) &&
      authenticated
  }

  render() {
    const {loading} = this.state
    const viewer = get(this.props, "viewer", null)

    if (loading) {
      return <div>Loading</div>
    } else if (this.viewerNeedsVerification) {
      return <Redirect to="verify_email" />
    }

    return (
      <div className="AppContainer mdc-typography">
        <Header viewer={viewer} />
        <div className="mdc-top-app-bar--fixed-adjust mdc-theme--text-primary-on-light">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <PrivateRoute
              exact
              path="/new"
              render={(routeProps) => <CreateStudyPage user={viewer} {...routeProps} />}
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
