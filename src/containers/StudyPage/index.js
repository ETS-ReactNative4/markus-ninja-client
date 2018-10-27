import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from 'components/PrivateRoute'
import environment from 'Environment'
import StudyHeader from './StudyHeader'
import StudyNav from './StudyNav'
import CreateCoursePage from 'containers/CreateCoursePage'
import CreateLessonPage from 'containers/CreateLessonPage'
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
import { isNil } from 'utils'

import "./styles.css"

const StudyPageQuery = graphql`
  query StudyPageQuery($owner: String!, $name: String!) {
    study(owner: $owner, name: $name) {
      ...CreateCoursePage_study
      ...CreateLessonPage_study
      ...LabelPage_study
      ...StudyHeader_study
      ...StudyNav_study
      ...StudyLabelsPage_study
      ...StudyLessonsPage_study
      ...StudyAssetsPage_study
      ...StudyCoursesPage_study
      ...StudySettingsPage_study
    }
    viewer {
      id
    }
  }
`

class StudyPage extends React.Component {
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
            if (isNil(props.study)) {
              return <NotFound />
            }

            const authenticated = !isNil(props.viewer)

            return (
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
                      <PrivateRoute
                        exact
                        path="/:owner/:name/lessons/new"
                        authenticated={authenticated}
                        render={(routeProps) => <CreateLessonPage {...routeProps} study={props.study} />}
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
                    </Switch>
                  </div>
                </div>
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
