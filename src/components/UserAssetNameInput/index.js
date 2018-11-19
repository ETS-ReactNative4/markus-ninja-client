import * as React from 'react'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { withRouter } from 'react-router'
import environment from 'Environment'
import UserAssetNameInputContainer, {defaultUserAssetNameState} from './UserAssetNameInputContainer'
import {get, isEmpty} from 'utils'

const UserAssetNameInputQuery = graphql`
  query UserAssetNameInputQuery (
    $owner: String!,
    $name: String!,
    $filename: String!
    $skip: Boolean!
  ) {
    ...UserAssetNameInputContainer_query @arguments(
      owner: $owner,
      name: $name,
      filename: $filename,
      skip: $skip,
    )
  }
`

class UserAssetNameInput extends React.Component {
  constructor(props) {
    super(props)

    const {initialValue} = this.props

    this.state = {initialValue}
  }

  render() {
    const {match} = this.props
    const {initialValue} = this.state

    return (
      <QueryRenderer
        environment={environment}
        query={UserAssetNameInputQuery}
        variables={{
          owner: get(match, "params.owner", ""),
          name: get(match, "params.name", ""),
          filename: initialValue,
          skip: isEmpty(initialValue),
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else {
            const {className, disabled, onChange, label, initialValue} = this.props

            return (
              <UserAssetNameInputContainer
                className={className}
                disabled={disabled}
                onChange={onChange}
                label={label}
                initialValue={initialValue}
                query={props}
              />
            )
          }
        }}
      />
    )
  }
}

export {defaultUserAssetNameState}
export default withRouter(UserAssetNameInput)
