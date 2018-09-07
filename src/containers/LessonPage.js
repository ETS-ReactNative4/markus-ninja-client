import * as React from 'react'
import cls from 'classnames'
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

class LessonPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("LessonPage mdc-layout-grid__inner", className)
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
              <div className={this.classes}>
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <LessonHeader lesson={lesson}/>
                </div>
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <LessonBody lesson={lesson}/>
                </div>
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <AddLessonCommentForm className="mt3" lesson={lesson} />
                </div>
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <LessonTimeline lesson={lesson} />
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

export default LessonPage
