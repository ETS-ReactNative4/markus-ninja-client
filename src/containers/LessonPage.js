import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import Lesson from 'components/Lesson'

import { EVENTS_PER_PAGE } from 'consts'

const LessonPageQuery = graphql`
  query LessonPageQuery($owner: String!, $name: String!, $number: Int!, $count: Int!, $after: String) {
    study(owner: $owner, name: $name) {
      lesson(number: $number) {
        ...Lesson_lesson
      }
    }
  }
`

class LessonPage extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={LessonPageQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
          number: parseInt(this.props.match.params.number, 10),
          count: EVENTS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return <Lesson lesson={props.study.lesson}></Lesson>
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default LessonPage
