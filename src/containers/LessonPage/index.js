import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import NotFound from 'components/NotFound'
import StudyLabels from 'components/StudyLabels'
import LoginLink from 'components/LoginLink'
import LessonCourse from './LessonCourse'
import LessonHeader from './LessonHeader'
import LessonLabels from './LessonLabels'
import LessonBody from './LessonBody'
import AddLessonCommentForm from './AddLessonCommentForm'
import LessonTimeline from './LessonTimeline'
import {get, isNil} from 'utils'

import { EVENTS_PER_PAGE } from 'consts'

import "./styles.css"

const LessonPageQuery = graphql`
  query LessonPageQuery($owner: String!, $name: String!, $number: Int!, $count: Int!, $after: String) {
    study(owner: $owner, name: $name) {
      lesson(number: $number) {
        id
        isCourseLesson
        ...LessonCourse_lesson
        ...LessonHeader_lesson
        ...LessonLabels_lesson
        ...LessonBody_lesson
        ...LessonTimeline_lesson
        ...AddLessonCommentForm_lesson
      }
    }
    viewer {
      id
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
          count: EVENTS_PER_PAGE,
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
                  <div className="LessonPage__container mdc-layout-grid__inner">
                    <LessonHeader className="LessonPage__header" lesson={lesson}/>
                    <LessonBody className="LessonPage__body" lesson={lesson}/>
                    <div className="LessonPage__meta mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                      <div className="center mw8">
                        <StudyLabels fragment="toggle">
                          <LessonLabels lesson={lesson}/>
                        </StudyLabels>
                        {lesson.isCourseLesson && <LessonCourse lesson={lesson} />}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="LessonPage__comments mdc-layout-grid">
                  <div className="LessonPage__comments__container mdc-layout-grid__inner mw8">
                    {isNil(props.viewer)
                    ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                        <LoginLink>Login to leave a comment</LoginLink>
                      </div>
                    : <AddLessonCommentForm className="mt3" lesson={lesson} />}
                    <LessonTimeline lesson={lesson} />
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

export default LessonPage
