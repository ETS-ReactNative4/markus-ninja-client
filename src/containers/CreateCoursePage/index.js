import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  QueryRenderer,
  graphql,
} from 'react-relay'
import {Redirect} from 'react-router-dom'
import environment from 'Environment'
import CreateCourseForm from './CreateCourseForm'
import {get} from 'utils'

const CreateCoursePageQuery = graphql`
  query CreateCoursePageQuery($owner: String!, $name: String!) {
    study(owner: $owner, name: $name) {
      ...CreateCourseForm_study
    }
  }
`

class CreateCoursePage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CreateCoursePage mdc-layout-grid mw7", className)
  }

  render() {
    const { match, study } = this.props

    if (!get(study, "viewerCanAdmin", false)) {
      return <Redirect to={get(study, "resourcePath", "")} />
    }

    return (
      <QueryRenderer
        environment={environment}
        query={CreateCoursePageQuery}
        variables={{
          owner: match.params.owner,
          name: match.params.name,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__inner">
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    <div className="mdc-typography--headline4">Create a new course</div>
                    <div className="mdc-typography--subtitle1 mdc-theme--text-secondary-on-light pb3">
                      Sort your lessons into sequential lists to be taken one after the other.
                    </div>
                  </div>
                  <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    <CreateCourseForm study={props.study} />
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

export default createFragmentContainer(CreateCoursePage, graphql`
  fragment CreateCoursePage_study on Study {
    resourcePath
    viewerCanAdmin
  }
`)
