import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import {Route, Switch} from 'react-router-dom'
import NotFound from 'components/NotFound'
import CreateLessonActivityPage from 'containers/CreateLessonActivityPage'
import LessonHomePage from 'containers/LessonHomePage'
import LessonActivitiesPage from 'containers/LessonActivitiesPage'
import LessonHeader from './LessonHeader'
import LessonNav from './LessonNav'
import {get} from 'utils'

const LessonPageQuery = graphql`
  query LessonPageQuery($owner: String!, $name: String!, $number: Int!) {
    study(owner: $owner, name: $name) {
      lesson(number: $number) {
        id
        ...LessonHeader_lesson
        ...LessonNav_lesson
        ...LessonActivitiesPage_lesson
      }
    }
  }
`

class LessonPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("LessonPage rn-page rn-page--column", className)
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={LessonPageQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
          number: parseInt(this.props.match.params.number, 10),
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const lesson = get(props, "study.lesson", null)

            if (!lesson) {
              return <NotFound />
            }

            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid">
                  <div className="mdc-layout-grid__inner mw8">
                    <LessonHeader className="LessonPage__header" lesson={lesson}/>
                    <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                      <LessonNav lesson={lesson} />
                    </div>
                  </div>
                </div>
                <Switch>
                  <Route
                    exact
                    path="/u/:owner/:name/lesson/:number"
                    render={(routeProps) => <LessonHomePage {...routeProps} lessonId={lesson.id} />}
                  />
                  <Route
                    exact
                    path="/u/:owner/:name/lesson/:number/activities"
                    render={(routeProps) => <LessonActivitiesPage {...routeProps} lesson={lesson} />}
                  />
                  <Route
                    exact
                    path="/u/:owner/:name/lesson/:number/activities/new"
                    component={CreateLessonActivityPage}
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

export default LessonPage
