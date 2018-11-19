import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'
import {get} from 'utils'

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
        if (deleteUserAssetField) {
          const deletedUserAssetId = deleteUserAssetField.getValue('deletedUserAssetId')
          const userAssetStudy = deleteUserAssetField.getLinkedRecord('study')
          if (userAssetStudy) {
            const studyAssetCount = userAssetStudy.getLinkedRecord('assets', {first: 0})
            const studyId = userAssetStudy.getValue('id')
            const study = proxyStore.get(studyId)
            if (study) {
              study.setLinkedRecord(studyAssetCount, 'assets', {first: 0})

              const studyAssets = ConnectionHandler.getConnection(
                study,
                "StudyAssets_assets",
              )
              studyAssets && ConnectionHandler.deleteNode(studyAssets, deletedUserAssetId)
              proxyStore.delete(deletedUserAssetId)
            }
          }
        }
      },
      onCompleted: (response, error) => {
        const deletedUserAssetId = get(response, "deleteUserAsset.deletedUserAssetId")
        callback(deletedUserAssetId, error)
      },
      onError: err => callback(null, err),
    },
  )
}
