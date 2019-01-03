import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'

const mutation = graphql`
  mutation AddActivityAssetMutation($input: AddActivityAssetInput!) {
    addActivityAsset(input: $input) {
      assetEdge {
        cursor
        node {
          ...ListUserAssetPreview_asset
          activityNumber
          id
          resourcePath
        }
      }
      activity {
        id
        assets(first: 0) {
          totalCount
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
        const addActivityAssetField = proxyStore.getRootField("addActivityAsset")
        if (addActivityAssetField) {
          const assetActivity = addActivityAssetField.getLinkedRecord('activity')
          const activityAssetCount = assetActivity &&
            assetActivity.getLinkedRecord('assets', {first: 0})
          const activity = proxyStore.get(activityId)
          if (activity) {
            activity.setLinkedRecord(activityAssetCount, 'assets', {first: 0})
            const activityAssets = ConnectionHandler.getConnection(
              activity,
              "ActivityAssets_assets",
            )
            const edge = addActivityAssetField.getLinkedRecord("assetEdge")
            activityAssets && ConnectionHandler.insertEdgeBefore(activityAssets, edge)
          }
        }
      },
      onCompleted: callback,
      onError: err => callback(null, err),
    },
  )
}
