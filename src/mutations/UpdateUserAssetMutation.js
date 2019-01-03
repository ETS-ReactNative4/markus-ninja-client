import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import { nullString } from 'utils'

const mutation = graphql`
  mutation UpdateUserAssetMutation($input: UpdateUserAssetInput!) {
    updateUserAsset(input: $input) {
      id
      description
      descriptionHTML
      name
      resourcePath
      updatedAt
      url
    }
  }
`

export default (userAssetId, description, name, callback) => {
  const variables = {
    input: {
      description,
      name: nullString(name),
      userAssetId: nullString(userAssetId),
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      onCompleted: (response, error) => {
        callback(response.updateUserAsset, error)
      },
      onError: err => callback(null, err),
    },
  )
}
