import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { isEmpty, nullString } from 'utils'

const mutation = graphql`
  mutation UpdateUserAssetMutation($input: UpdateUserAssetInput!) {
    updateUserAsset(input: $input) {
      id
      name
      updatedAt
    }
  }
`

export default (userAssetId, name, callback) => {
  const variables = {
    input: {
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
        if (!isEmpty(name)) {
          userAsset.setValue(name, 'name')
        }
      },
      updater: proxyStore => {
        const updateUserAssetField = proxyStore.getRootField('updateUserAsset')
        const newTitle = updateUserAssetField.getValue('name')
        const newUpdatedAt = updateUserAssetField.getValue('updatedAt')

        const userAsset = proxyStore.get(userAssetId)
        if (userAsset) {
          userAsset.setValue(newTitle, 'name')
          userAsset.setValue(newUpdatedAt, 'updatedAt')
        }
      },
      onCompleted: (response, error) => {
        callback(response.updateUserAsset, error)
      },
      onError: err => console.error(err),
    },
  )
}
