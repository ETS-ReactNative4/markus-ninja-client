import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  QueryRenderer,
  graphql,
} from 'react-relay'
import {Redirect} from 'react-router-dom'
import environment from 'Environment'
import NotFound from 'components/NotFound'
import UpdateCourseNameForm from './UpdateCourseNameForm'
import {get} from 'utils'

const CourseSettingsPageQuery = graphql`
  query CourseSettingsPageQuery(
    $owner: String!,
    $name: String!,
    $number: Int!,
  ) {
    study(owner: $owner, name: $name) {
      course(number: $number) {
        ...UpdateCourseNameForm_course
      }
    }
  }
`

class CourseSettingsPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CourseSettingsPage mdc-layout-grid__inner", className)
  }

  render() {
    const { match, course } = this.props

    if (!get(course, "viewerCanAdmin", false)) {
      return <Redirect to={get(course, "resourcePath", "")} />
    }

    return (
      <QueryRenderer
        environment={environment}
        query={CourseSettingsPageQuery}
        variables={{
          owner: match.params.owner,
          name: match.params.name,
          number: parseInt(match.params.number, 10),
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const course = get(props, "study.course", null)
            if (!course) {
              return <NotFound />
            }

            return (
              <div className={this.classes}>
                <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">Settings</h5>
                <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <UpdateCourseNameForm course={course} />
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

export default createFragmentContainer(CourseSettingsPage, graphql`
  fragment CourseSettingsPage_course on Course {
    resourcePath
    viewerCanAdmin
  }
`)
