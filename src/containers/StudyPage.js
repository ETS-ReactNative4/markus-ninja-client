import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { Route, Switch } from 'react-router-dom'
import environment from 'Environment'
import Study from 'components/Study'
import CreateLessonPage from 'containers/CreateLessonPage'
import LessonPage from 'containers/LessonPage'
import LessonListPage from 'containers/LessonListPage'

const StudyPageQuery = graphql`
  query StudyPageQuery($owner: String!, $name: String!) {
    study(owner: $owner, name: $name) {
      ...Study_study
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
            return (
              <div className="StudyPage">
                <Study study={props.study}></Study>
                <Switch>
                  <Route
                    exact
                    path="/:owner/:name/lesson/:number"
                    component={LessonPage}
                  />
                  <Route
                    exact
                    path="/:owner/:name/lessons"
                    component={LessonListPage}
                  />
                  <Route
                    exact
                    path="/:owner/:name/lessons/new"
                    render={() => <CreateLessonPage study={props.study} />}
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
