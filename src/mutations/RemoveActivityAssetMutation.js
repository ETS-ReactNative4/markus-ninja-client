import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'

const mutation = graphql`
  mutation RemoveActivityAssetMutation($input: RemoveActivityAssetInput!) {
    removeActivityAsset(input: $input) {
      activity {
        id
        assets(first: 0) {
          totalCount
        }
      }
      removedAssetId
      removedAssetEdge {
        node {
          id
          activityNumber
          name
        }
      }
    }
  }
`

export default (activityId, assetId, callback) => {
  const variables = {
    input: {
      activityId,
      assetId,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const removeActivityAssetField = proxyStore.getRootField('removeActivityAsset')
        if (removeActivityAssetField) {
          const assetActivity = removeActivityAssetField.getLinkedRecord('activity')
          if (assetActivity) {
            const assetActivityId = assetActivity.getValue('id')
            const activityAssetCount = assetActivity.getLinkedRecord('assets', {first: 0})
            const activity = proxyStore.get(assetActivityId)
            if (activity) {
              activity.setLinkedRecord(activityAssetCount, 'assets', {first: 0})

              const removedAssetId = removeActivityAssetField.getValue('removedAssetId')
              const activityAssets = ConnectionHandler.getConnection(
                activity,
                "ActivityAssets_assets",
              )
              activityAssets && ConnectionHandler.deleteNode(activityAssets, removedAssetId)
            }
          }
        }
      },
      onCompleted: callback,
      onError: err => callback(null, err),
    },
  )
}
