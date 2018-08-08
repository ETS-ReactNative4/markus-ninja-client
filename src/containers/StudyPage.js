import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { Route, Switch } from 'react-router-dom'
import environment from 'Environment'
import Study from 'components/Study'
import CreateCoursePage from 'containers/CreateCoursePage'
import CreateLessonPage from 'containers/CreateLessonPage'
import CoursePage from 'containers/CoursePage'
import StudyCoursesPage from 'containers/StudyCoursesPage'
import StudyLabelsPage from 'containers/StudyLabelsPage'
import LessonPage from 'containers/LessonPage'
import StudyLessonsPage from 'containers/StudyLessonsPage'
import AssetPage from 'containers/AssetPage'
import StudyAssetsPage from 'containers/StudyAssetsPage'
import StudyOverviewPage from 'containers/StudyOverviewPage'
import StudySettingsPage from 'containers/StudySettingsPage'
import NotFound from 'components/NotFound'
import { isNil } from 'utils'

const StudyPageQuery = graphql`
  query StudyPageQuery($owner: String!, $name: String!) {
    study(owner: $owner, name: $name) {
      ...Study_study
      ...StudyLabelsPage_study
    }
  }
`

class StudyPage extends Component {
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
            if (isNil(props.study)) {
              return <NotFound />
            }
            return (
              <div className="StudyPage">
                <Study study={props.study}></Study>
                <Switch>
                  <Route
                    exact
                    path="/:owner/:name"
                    component={StudyOverviewPage}
                  />
                  <Route
                    exact
                    path="/:owner/:name/course/:number"
                    component={CoursePage}
                  />
                  <Route
                    exact
                    path="/:owner/:name/courses"
                    component={StudyCoursesPage}
                  />
                  <Route
                    exact
                    path="/:owner/:name/courses/new"
                    component={CreateCoursePage}
                  />
                  <Route
                    exact
                    path="/:owner/:name/labels"
                    render={(routeProps) => <StudyLabelsPage {...routeProps} study={props.study} />}
                  />
                  <Route
                    exact
                    path="/:owner/:name/lesson/:number"
                    component={LessonPage}
                  />
                  <Route
                    exact
                    path="/:owner/:name/lessons"
                    component={StudyLessonsPage}
                  />
                  <Route
                    exact
                    path="/:owner/:name/lessons/new"
                    component={CreateLessonPage}
                  />
                  <Route
                    exact
                    path="/:owner/:name/asset/:filename"
                    component={AssetPage}
                  />
                  <Route
                    exact
                    path="/:owner/:name/assets"
                    component={StudyAssetsPage}
                  />
                  <Route
                    exact
                    path="/:owner/:name/settings"
                    component={StudySettingsPage}
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

export default StudyPage
