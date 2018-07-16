import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import environment from 'Environment'
import LessonPreview from 'components/LessonPreview'
import StudyHeader from 'components/StudyHeader'
import { get, isNil } from 'utils'

const StudyOverviewPageQuery = graphql`
  query StudyOverviewPageQuery($owner: String!, $name: String!) {
    study(owner: $owner, name: $name) {
      id
      description
      resourcePath
      lesson(number: 1) {
        ...LessonPreview_lesson
      }
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
        }}
        render={({error,  props}) => {
          const lesson = get(props, "study.lesson", null)
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div>
                <StudyHeader study={get(props, "study", {})}  />
                {isNil(lesson)
                ? <Link
                    className="LessonList__new-lesson"
                    to={get(props, "study.resourcePath", "") + "/lessons/new"}
                  >
                    Create a lesson
                  </Link>
                : <LessonPreview lesson={get(props, "study.lesson", null)} />}
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
