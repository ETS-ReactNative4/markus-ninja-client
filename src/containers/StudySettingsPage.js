import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import StudySettings from 'components/StudySettings'

const StudySettingsPageQuery = graphql`
  query StudySettingsPageQuery($owner: String!, $name: String!) {
    study(owner: $owner, name: $name) {
      ...StudySettings_study
    }
  }
`

class StudySettingsPage extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={StudySettingsPageQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return <StudySettings study={props.study}></StudySettings>
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default StudySettingsPage
