import * as React from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import StudyAssetNameInput from './StudyAssetNameInput'
import {get, isEmpty} from 'utils'

const UserAssetNameInputQuery = graphql`
  query UserAssetNameInputQuery (
    $owner: String!,
    $name: String!,
    $filename: String!
    $skip: Boolean!
  ) {
    study(owner: $owner, name: $name) @skip(if: $skip){
      ...StudyAssetNameInput_study
    }
  }
`

class UserAssetNameInput extends React.Component {
  render() {
    const {className, match, value} = this.props

    return (
      <QueryRenderer
        environment={environment}
        query={UserAssetNameInputQuery}
        variables={{
          owner: get(match, "params.owner", ""),
          name: get(match, "params.name", ""),
          filename: value,
          skip: isEmpty(value),
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else {
            return (
              <StudyAssetNameInput
                className={className}
                value={value}
                study={get(props, "study", null)}
              />
            )
          }
        }}
      />
    )
  }
}

export default withRouter(UserAssetNameInput)
