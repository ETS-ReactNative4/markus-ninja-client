import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import environment from 'Environment'
import LessonPreview from 'components/LessonPreview'
import StudyMeta from 'components/StudyMeta'
import { get, isNil } from 'utils'
import { TOPICS_PER_PAGE } from 'consts'

const StudyOverviewPageQuery = graphql`
  query StudyOverviewPageQuery($owner: String!, $name: String!, $count: Int!, $after: String) {
    study(owner: $owner, name: $name) {
      id
      lesson(number: 1) {
        ...LessonPreview_lesson
      }
      resourcePath
      ...StudyMeta_study
    }
  }
`

class StudyOverviewPage extends Component {
  render() {
    const { match } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={StudyOverviewPageQuery}
        variables={{
          owner: match.params.owner,
          name: match.params.name,
          count: TOPICS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            if (isNil(props.study)) {
              return null
            }
            const lesson = get(props, "study.lesson", null)
            return (
              <div className="StudyOverviewPage mt2">
                <StudyMeta study={props.study}  />
                {isNil(lesson)
                ? <Link
                    className="LessonList__new-lesson"
                    to={get(props, "study.resourcePath", "") + "/lessons/new"}
                  >
                    Create a lesson
                  </Link>
                : <LessonPreview lesson={lesson} />}
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(StudyOverviewPage)
