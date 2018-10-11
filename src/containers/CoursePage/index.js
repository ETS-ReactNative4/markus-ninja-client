import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import {Route, Switch} from 'react-router-dom'
import environment from 'Environment'
import PrivateRoute from 'components/PrivateRoute'
import CourseOverviewPage from 'containers/CourseOverviewPage'
import CourseAppleGiversPage from 'containers/CourseAppleGiversPage'
import CourseSettingsPage from 'containers/CourseSettingsPage'
import NotFound from 'components/NotFound'
import CourseHeader from './CourseHeader'
import CourseNav from './CourseNav'
import { get, isNil } from 'utils'

import "./styles.css"

const CoursePageQuery = graphql`
  query CoursePageQuery(
    $owner: String!,
    $name: String!,
    $number: Int!,
  ) {
    study(owner: $owner, name: $name) {
      course(number: $number) {
        id
        ...CourseHeader_course
        ...CourseNav_course
        ...CourseSettingsPage_course
      }
    }
    viewer {
      id
    }
  }
`

class CoursePage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CoursePage mdc-layout-grid", className)
  }

  render() {
    const {match} = this.props

    return (
      <QueryRenderer
        environment={environment}
        query={CoursePageQuery}
        variables={{
          owner: match.params.owner,
          name: match.params.name,
          number: parseInt(match.params.number, 10),
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const course = get(props, "study.course", null)
            if (isNil(course)) {
              return <NotFound />
            }

            const authenticated = !isNil(props.viewer)

            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__inner">
                  <CourseHeader course={course} />
                  <CourseNav course={course} />
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    <Switch>
                      <Route
                        exact
                        path="/:owner/:name/course/:number"
                        render={(routeProps) => <CourseOverviewPage {...routeProps} course={course} />}
                      />
                      <Route
                        exact
                        path="/:owner/:name/course/:number/applegivers"
                        component={CourseAppleGiversPage}
                      />
                      <PrivateRoute
                        exact
                        path="/:owner/:name/course/:number/settings"
                        authenticated={authenticated}
                        render={(routeProps) => <CourseSettingsPage {...routeProps} course={course} />}
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

export default CoursePage
