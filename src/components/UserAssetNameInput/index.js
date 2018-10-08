import * as React from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import UserAssetNameInputContainer from './UserAssetNameInputContainer'
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

    const {value} = this.props

    this.state = {value}
  }

  render() {
    const {match} = this.props
    const {value} = this.state

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
            const {className, disabled, onChange, placeholder, value} = this.props

            return (
              <UserAssetNameInputContainer
                className={className}
                disabled={disabled}
                onChange={onChange}
                placeholder={placeholder}
                value={value}
                query={props}
              />
            )
          }
        }}
      />
    )
  }
}

export default withRouter(UserAssetNameInput)
