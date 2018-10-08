import {
  commitMutation,
  graphql,
} from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'
import { get, isNil } from 'utils'

const mutation = graphql`
  mutation DeleteUserAssetMutation($input: DeleteUserAssetInput!) {
    deleteUserAsset(input: $input) {
      deletedUserAssetId
      study {
        id
        assetCount
      }
    }
  }
`

export default (userAssetId, callback) => {
  const variables = {
    input: {
      userAssetId,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const deleteUserAssetField = proxyStore.getRootField('deleteUserAsset')
        if (!isNil(deleteUserAssetField)) {
          const deletedUserAssetId = deleteUserAssetField.getValue('deletedUserAssetId')
          const userAssetStudy = deleteUserAssetField.getLinkedRecord('study')
          const studyAssetCount = userAssetStudy.getValue('assetCount')
          const studyId = userAssetStudy.getValue('id')
          const study = proxyStore.get(studyId)
          study.setValue(studyAssetCount, 'assetCount')

          const studyAssets = ConnectionHandler.getConnection(
            study,
            "StudyAssets_assets",
          )
          studyAssets && ConnectionHandler.deleteNode(studyAssets, deletedUserAssetId)
          proxyStore.delete(deletedUserAssetId)
        }
      },
      onCompleted: (response, error) => {
        const deletedUserAssetId = get(response, "deleteUserAsset.deletedUserAssetId")
        callback(deletedUserAssetId, error)
      },
      onError: err => console.error(err),
    },
  )
}
