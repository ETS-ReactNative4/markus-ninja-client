import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {Redirect} from 'react-router-dom'
import environment from 'Environment'
import NotFound from 'components/NotFound'
import StudySettings from './StudySettings'
import {get, isNil} from 'utils'

const StudySettingsPageQuery = graphql`
  query StudySettingsPageQuery($owner: String!, $name: String!) {
    study(owner: $owner, name: $name) {
      ...StudySettings_study
      resourcePath
      viewerCanAdmin
    }
  }
`

class StudySettingsPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudySettingsPage mdc-layout-grid__inner mw7", className)
  }

  render() {
    const { match, study } = this.props

    if (!get(study, "viewerCanAdmin", false)) {
      return <Redirect to={get(study, "resourcePath", "")} />
    }

    return (
      <QueryRenderer
        environment={environment}
        query={StudySettingsPageQuery}
        variables={{
          owner: match.params.owner,
          name: match.params.name,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            if (isNil(props.study)) {
              return <NotFound />
            }

            return (
              <div className={this.classes}>
                <StudySettings study={props.study} />
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default createFragmentContainer(StudySettingsPage, graphql`
  fragment StudySettingsPage_study on Study {
    resourcePath
    viewerCanAdmin
  }
`)
