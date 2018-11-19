import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { Route, Switch } from 'react-router-dom'
import environment from 'Environment'
import PrivateRoute from 'components/PrivateRoute'
import CreateLabelDialog from 'components/CreateLabelDialog'
import CreateLessonDialog from 'components/CreateLessonDialog'
import CreateUserAssetDialog from 'components/CreateUserAssetDialog'
import CreateCoursePage from 'containers/CreateCoursePage'
import LabelPage from 'containers/LabelPage'
import StudyCoursesPage from 'containers/StudyCoursesPage'
import StudyLabelsPage from 'containers/StudyLabelsPage'
import StudyLessonsPage from 'containers/StudyLessonsPage'
import StudyAppleGiversPage from 'containers/StudyAppleGiversPage'
import StudyAssetsPage from 'containers/StudyAssetsPage'
import StudyEnrolleesPage from 'containers/StudyEnrolleesPage'
import StudyOverviewPage from 'containers/StudyOverviewPage'
import StudySettingsPage from 'containers/StudySettingsPage'
import NotFound from 'components/NotFound'
import AppContext from 'containers/App/Context'
import {get} from 'utils'

import Context from './Context'
import StudyHeader from './StudyHeader'
import StudyNav from './StudyNav'

import "./styles.css"

const StudyPageQuery = graphql`
  query StudyPageQuery($owner: String!, $name: String!) {
    study(owner: $owner, name: $name) {
      ...CreateCoursePage_study
      ...CreateLessonPage_study
      ...CreateLabelDialog_study
      ...CreateLessonDialog_study
      ...CreateUserAssetDialog_study
      ...StudyHeader_study
      ...StudyNav_study
      ...StudyLabelsPage_study
      ...StudyLessonsPage_study
      ...StudyAssetsPage_study
      ...StudyCoursesPage_study
      ...StudySettingsPage_study
      viewerCanAdmin
    }
  }
`

class StudyPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      createLabelDialogOpen: false,
      createLessonDialogOpen: false,
      createUserAssetDialogOpen: false,
      toggleCreateLabelDialog: this.handleToggleCreateLabelDialog,
      toggleCreateLessonDialog: this.handleToggleCreateLessonDialog,
      toggleCreateUserAssetDialog: this.handleToggleCreateUserAssetDialog,
    }
  }

  handleToggleCreateLabelDialog = () => {
    const {createLabelDialogOpen} = this.state
    this.setState({createLabelDialogOpen: !createLabelDialogOpen})
  }

  handleToggleCreateLessonDialog = () => {
    const {createLessonDialogOpen} = this.state
    this.setState({createLessonDialogOpen: !createLessonDialogOpen})
  }

  handleToggleCreateUserAssetDialog = () => {
    const {createUserAssetDialogOpen} = this.state
    this.setState({createUserAssetDialogOpen: !createUserAssetDialogOpen})
  }

  get classes() {
    const {className} = this.props
    return cls("StudyPage rn-page mdc-layout-grid", className)
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={StudyPageQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            if (!props.study) {
              return <NotFound />
            }

            const {
              createLabelDialogOpen,
              createLessonDialogOpen,
              createUserAssetDialogOpen,
            } = this.state
            const authenticated = this.context.isAuthenticated()
            const viewerCanAdmin = get(props, "study.viewerCanAdmin", false)

            return (
              <Context.Provider value={this.state}>
                <div className={this.classes}>
                  <div className="StudyPage__container mdc-layout-grid__inner">
                    <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                      <StudyHeader study={props.study} />
                    </div>
                    <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                      <StudyNav study={props.study} />
                    </div>
                    <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                      <Switch>
                        <Route
                          exact
                          path="/:owner/:name"
                          render={(routeProps) => <StudyOverviewPage {...routeProps} study={props.study} />}
                        />
                        <Route
                          exact
                          path="/:owner/:name/courses"
                          render={(routeProps) => <StudyCoursesPage {...routeProps} study={props.study} />}
                        />
                        <PrivateRoute
                          exact
                          path="/:owner/:name/courses/new"
                          authenticated={authenticated}
                          render={(routeProps) => <CreateCoursePage {...routeProps} study={props.study} />}
                        />
                        <Route
                          exact
                          path="/:owner/:name/applegivers"
                          component={StudyAppleGiversPage}
                        />
                        <Route
                          exact
                          path="/:owner/:name/enrollees"
                          component={StudyEnrolleesPage}
                        />
                        <Route
                          exact
                          path="/:owner/:name/labels"
                          render={(routeProps) => <StudyLabelsPage {...routeProps} study={props.study} />}
                        />
                        <Route
                          exact
                          path="/:owner/:name/labels/:label"
                          render={(routeProps) => <LabelPage {...routeProps} study={props.study} />}
                        />
                        <Route
                          exact
                          path="/:owner/:name/lessons"
                          render={(routeProps) => <StudyLessonsPage {...routeProps} study={props.study} />}
                        />
                        <Route
                          exact
                          path="/:owner/:name/assets"
                          render={(routeProps) => <StudyAssetsPage {...routeProps} study={props.study} />}
                        />
                        <PrivateRoute
                          exact
                          path="/:owner/:name/settings"
                          authenticated={authenticated}
                          render={(routeProps) => <StudySettingsPage {...routeProps} study={props.study} />}
                        />
                        <Route component={NotFound} />
                      </Switch>
                    </div>
                  </div>
                </div>
                {viewerCanAdmin &&
                <CreateLabelDialog
                  open={createLabelDialogOpen}
                  study={props.study}
                />}
                {viewerCanAdmin &&
                <CreateLessonDialog
                  open={createLessonDialogOpen}
                  study={props.study}
                />}
                {viewerCanAdmin &&
                <CreateUserAssetDialog
                  open={createUserAssetDialogOpen}
                  study={props.study}
                />}
              </Context.Provider>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

StudyPage.contextType = AppContext

export default StudyPage
