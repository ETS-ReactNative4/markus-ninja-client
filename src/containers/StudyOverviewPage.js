import * as React from 'react'
import cls from 'classnames'
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

class StudyOverviewPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudyOverviewPage mdc-layout-grid__inner", className)
  }

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
              <div className={this.classes}>
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <StudyMeta study={props.study}  />
                </div>
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  {isNil(lesson)
                  ? <Link
                      className="rn-link"
                      to={get(props, "study.resourcePath", "") + "/lessons/new"}
                    >
                      Create a lesson
                    </Link>
                  : <LessonPreview lesson={lesson} />}
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

export default withRouter(StudyOverviewPage)
