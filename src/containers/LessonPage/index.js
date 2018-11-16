import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import NotFound from 'components/NotFound'
import StudyLabels from 'components/StudyLabels'
import {Link} from 'react-router-dom'
import LessonCourse from './LessonCourse'
import LessonHeader from './LessonHeader'
import LessonLabels from './LessonLabels'
import LessonBody from './LessonBody'
import AddLessonCommentForm from './AddLessonCommentForm'
import LessonTimeline from './LessonTimeline'
import AppContext from 'containers/App/Context'
import {get} from 'utils'

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
  }
`

class LessonPage extends React.Component {
  lessonTimelineElement_ = React.createRef()

  handleLabelToggled_ = (checked) => {
    this.lessonTimelineElement_ && this.lessonTimelineElement_.current &&
      this.lessonTimelineElement_.current.refetch()
  }


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
                <div className="mdc-layout-grid mw8">
                  <div className="LessonPage__container mdc-layout-grid__inner">
                    <LessonHeader className="LessonPage__header" lesson={lesson}/>
                    <LessonBody className="LessonPage__body" lesson={lesson}/>
                    <div className="LessonPage__meta mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                      <div className="center mw8">
                        <StudyLabels fragment="toggle">
                          <LessonLabels lesson={lesson} onLabelToggled={this.handleLabelToggled_} />
                        </StudyLabels>
                        {lesson.isCourseLesson && <LessonCourse lesson={lesson} />}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="LessonPage__timeline mdc-layout-grid">
                  <div className="LessonPage__timeline__container mdc-layout-grid__inner mw7">
                    {!this.context.isAuthenticated()
                    ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                        <div className="mdc-card mdc-card--outlined">
                          <div className="rn-card__header">
                            <Link className="rn-link rn-link--underlined mr1" to="signin">Sign in</Link>
                            or
                            <Link className="rn-link rn-link--underlined mh1" to="signup">Sign up</Link>
                            to leave a comment
                          </div>
                        </div>
                      </div>
                    : <AddLessonCommentForm lesson={lesson} />}
                    <LessonTimeline ref={this.lessonTimelineElement_} lesson={lesson} />
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

LessonPage.contextType = AppContext

export default LessonPage
