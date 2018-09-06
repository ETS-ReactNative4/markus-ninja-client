import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import StudySettings from 'components/StudySettings'
import { isNil } from 'utils'

const StudySettingsPageQuery = graphql`
  query StudySettingsPageQuery($owner: String!, $name: String!) {
    study(owner: $owner, name: $name) {
      ...StudySettings_study
    }
  }
`

class StudySettingsPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudySettingsPage", className)
  }

  render() {
    const { match } = this.props
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
              return null
            }
            return (
              <div className={this.classe}>
                <StudySettings study={props.study}></StudySettings>
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default StudySettingsPage
