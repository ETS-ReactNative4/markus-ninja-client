import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  QueryRenderer,
  graphql,
} from 'react-relay'
import {Redirect} from 'react-router-dom'
import environment from 'Environment'
import CreateLessonForm from './CreateLessonForm'
import {get} from 'utils'
import { COURSES_PER_PAGE } from 'consts'

import "./styles.css"

const CreateLessonPageQuery = graphql`
  query CreateLessonPageQuery($owner: String!, $name: String!, $count: Int!, $after: String, $filename: String!) {
    study(owner: $owner, name: $name) {
      ...CreateLessonForm_study
    }
  }
`

class CreateLessonPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CreateLessonPage mdc-layout-grid__inner", className)
  }

  render() {
    const { match, study } = this.props

    if (!get(study, "viewerCanAdmin", false)) {
      return <Redirect to={get(study, "resourcePath", "")} />
    }

    return (
      <QueryRenderer
        environment={environment}
        query={CreateLessonPageQuery}
        variables={{
          owner: match.params.owner,
          name: match.params.name,
          count: COURSES_PER_PAGE,
          filename: "",
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <div className="mdc-typography--headline4">Create a new lesson</div>
                  <div className="mdc-typography--subtitle1 mdc-theme--text-secondary-on-light">
                    Teach us
                  </div>
                </div>
                <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <CreateLessonForm study={props.study} />
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

export default createFragmentContainer(CreateLessonPage, graphql`
  fragment CreateLessonPage_study on Study {
    resourcePath
    viewerCanAdmin
  }
`)
