import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {Redirect} from 'react-router-dom'
import environment from 'Environment'
import CreateActivityForm from './CreateActivityForm'
import {get} from 'utils'

import "./styles.css"

const CreateActivityPageQuery = graphql`
  query CreateActivityPageQuery($owner: String!, $name: String!) {
    study(owner: $owner, name: $name) {
      ...CreateActivityForm_study
    }
  }
`

class CreateActivityPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CreateActivityPage mdc-layout-grid__inner", className)
  }

  render() {
    const { match, study } = this.props

    if (!get(study, "viewerCanAdmin", false)) {
      return <Redirect to={get(study, "resourcePath", "")} />
    }

    return (
      <QueryRenderer
        environment={environment}
        query={CreateActivityPageQuery}
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
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <div className="mdc-typography--headline4">Create a new activity</div>
                  <div className="mdc-typography--subtitle1 mdc-theme--text-secondary-on-light pb3">
                    Organize your assets into lists of examples for a lesson.
                  </div>
                </div>
                <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <CreateActivityForm study={props.study} />
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

export default createFragmentContainer(CreateActivityPage, graphql`
  fragment CreateActivityPage_study on Study {
    resourcePath
    viewerCanAdmin
  }
`)
