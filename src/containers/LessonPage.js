import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import NotFound from 'components/NotFound'
import LessonBody from 'components/LessonBody'
import LessonHeader from 'components/LessonHeader'
import LessonTimeline from 'components/LessonTimeline'
import AddLessonCommentForm from 'components/AddLessonCommentForm'
import { get } from 'utils'

import { EVENTS_PER_PAGE } from 'consts'

const LessonPageQuery = graphql`
  query LessonPageQuery($owner: String!, $name: String!, $number: Int!, $count: Int!, $after: String, $filename: String!) {
    study(owner: $owner, name: $name) {
      lesson(number: $number) {
        id
        ...LessonHeader_lesson
        ...LessonBody_lesson
        ...LessonTimeline_lesson
        ...AddLessonCommentForm_lesson
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
          filename: "",
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
              <div className="LessonPage flex flex-column">
                <LessonHeader lesson={lesson}/>
                <LessonBody lesson={lesson}/>
                <AddLessonCommentForm className="mt3" lesson={lesson} />
                <LessonTimeline lesson={lesson} />
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
