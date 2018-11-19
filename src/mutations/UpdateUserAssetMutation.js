import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import { isEmpty, nullString } from 'utils'

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
      optimisticUpdater: proxyStore => {
        const userAsset = proxyStore.get(userAssetId)
        if (userAsset) {
          if (!isEmpty(description)) {
            userAsset.setValue(description, 'description')
          }
          if (!isEmpty(name)) {
            userAsset.setValue(name, 'name')
          }
        }
      },
      updater: proxyStore => {
        const updateUserAssetField = proxyStore.getRootField('updateUserAsset')
        if (updateUserAssetField) {
          const newDescription = updateUserAssetField.getValue('description')
          const newDescriptionHTML = updateUserAssetField.getValue('descriptionHTML')
          const newName = updateUserAssetField.getValue('name')
          const newResourcePath = updateUserAssetField.getValue('resourcePath')
          const newUpdatedAt = updateUserAssetField.getValue('updatedAt')
          const newUrl = updateUserAssetField.getValue('url')

          const userAsset = proxyStore.get(userAssetId)
          if (userAsset) {
            userAsset.setValue(newDescription, 'description')
            userAsset.setValue(newDescriptionHTML, 'descriptionHTML')
            userAsset.setValue(newName, 'name')
            userAsset.setValue(newResourcePath, 'resourcePath')
            userAsset.setValue(newUpdatedAt, 'updatedAt')
            userAsset.setValue(newUrl, 'url')
          }
        }
      },
      onCompleted: (response, error) => {
        callback(response.updateUserAsset, error)
      },
      onError: err => callback(null, err),
    },
  )
}
