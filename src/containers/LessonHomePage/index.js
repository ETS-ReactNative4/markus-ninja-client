import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import {Link} from 'react-router-dom'
import NotFound from 'components/NotFound'
import StudyLabels from 'components/StudyLabels'
import AddCommentForm from 'components/AddCommentForm'
import LessonCourse from './LessonCourse'
import LessonLabels from './LessonLabels'
import LessonBody from './LessonBody'
import LessonTimeline from './LessonTimeline'
import AppContext from 'containers/App/Context'
import {get} from 'utils'

import { EVENTS_PER_PAGE } from 'consts'

import "./styles.css"

const LessonHomePageQuery = graphql`
  query LessonHomePageQuery($lessonId: ID!, $count: Int!, $after: String) {
    node(id: $lessonId) {
      id
      ...on Lesson {
        isCourseLesson
        ...LessonCourse_lesson
        ...LessonLabels_lesson
        ...LessonBody_lesson
        ...LessonTimeline_lesson
        ...AddCommentForm_commentable
      }
    }
  }
`

class LessonHomePage extends React.Component {
  lessonTimelineElement_ = React.createRef()

  handleLabelToggled_ = (checked) => {
    this.lessonTimelineElement_ && this.lessonTimelineElement_.current &&
      this.lessonTimelineElement_.current.refetch()
  }

  get classes() {
    const {className} = this.props
    return cls("LessonHomePage rn-page rn-page--column", className)
  }

  render() {
    const {lessonId} = this.props

    return (
      <QueryRenderer
        environment={environment}
        query={LessonHomePageQuery}
        variables={{
          lessonId,
          count: EVENTS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const lesson = get(props, "node", null)

            if (!lesson) {
              return <NotFound />
            }

            return (
              <React.Fragment>
                <div className="mdc-layout-grid">
                  <div className="mdc-layout-grid__inner mw8">
                    {lesson.isCourseLesson &&
                    <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                      <LessonCourse lesson={lesson} />
                    </div>}
                    <LessonBody className="LessonHomePage__body" lesson={lesson}/>
                    <div className="LessonHomePage__meta mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                      <div className="center mw8">
                        <StudyLabels fragment="toggle">
                          <LessonLabels lesson={lesson} onLabelToggled={this.handleLabelToggled_} />
                        </StudyLabels>
                        {lesson.isCourseLesson && <LessonCourse lesson={lesson} />}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="LessonHomePage__timeline mdc-layout-grid">
                  <div className="mdc-layout-grid__inner mw7">
                    {!this.context.isAuthenticated()
                    ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                        <div className="mdc-card mdc-card--outlined">
                          <div className="rn-card__header">
                            <Link className="rn-link mr1" to="/signin">Sign in</Link>
                            or
                            <Link className="rn-link mh1" to="/signup">Sign up</Link>
                            to leave a comment
                          </div>
                        </div>
                      </div>
                    : <AddCommentForm commentable={lesson} />}
                    <LessonTimeline ref={this.lessonTimelineElement_} lesson={lesson} />
                  </div>
                </div>
              </React.Fragment>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

LessonHomePage.propTypes = {
  lessonId: PropTypes.string.isRequired,
}

LessonHomePage.contextType = AppContext

export default LessonHomePage
