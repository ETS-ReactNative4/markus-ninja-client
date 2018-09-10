import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { Route, Switch } from 'react-router-dom'
import environment from 'Environment'
import StudyHeader from './StudyHeader'
import CreateCoursePage from 'containers/CreateCoursePage'
import CreateLessonPage from 'containers/CreateLessonPage'
import StudyCoursesPage from 'containers/StudyCoursesPage'
import StudyLabelsPage from 'containers/StudyLabelsPage'
import StudyLessonsPage from 'containers/StudyLessonsPage'
import UserAssetPage from 'containers/UserAssetPage'
import StudyAssetsPage from 'containers/StudyAssetsPage'
import StudyOverviewPage from 'containers/StudyOverviewPage'
import StudySettingsPage from 'containers/StudySettingsPage'
import NotFound from 'components/NotFound'
import { isNil } from 'utils'

import "./styles.css"

const StudyPageQuery = graphql`
  query StudyPageQuery($owner: String!, $name: String!) {
    study(owner: $owner, name: $name) {
      ...StudyHeader_study
      ...StudyLabelsPage_study
      ...StudyLessonsPage_study
      ...StudyAssetsPage_study
      ...StudyCoursesPage_study
    }
  }
`

class StudyPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudyPage mdc-layout-grid", className)
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
            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__inner">
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    <StudyHeader study={props.study} />
                  </div>
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    <Switch>
                      <Route
                        exact
                        path="/:owner/:name"
                        component={StudyOverviewPage}
                      />
                      <Route
                        exact
                        path="/:owner/:name/courses"
                        render={(routeProps) => <StudyCoursesPage {...routeProps} study={props.study} />}
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
                        path="/:owner/:name/lessons"
                        render={(routeProps) => <StudyLessonsPage {...routeProps} study={props.study} />}
                      />
                      <Route
                        exact
                        path="/:owner/:name/lessons/new"
                        component={CreateLessonPage}
                      />
                      <Route
                        exact
                        path="/:owner/:name/asset/:filename"
                        component={UserAssetPage}
                      />
                      <Route
                        exact
                        path="/:owner/:name/assets"
                        render={(routeProps) => <StudyAssetsPage {...routeProps} study={props.study} />}
                      />
                      <Route
                        exact
                        path="/:owner/:name/settings"
                        component={StudySettingsPage}
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
