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
        assets(first: 0) {
          totalCount
        }
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
          const userAssetStudyAssets = userAssetStudy.getLinkedRecord('assets', {first: 0})
          const userAssetStudyId = deleteUserAssetField.getLinkedRecord('study').getValue('id')
          const study = proxyStore.get(userAssetStudyId)
          study.setLinkedRecord(userAssetStudyAssets, 'assets', {first: 0})

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
