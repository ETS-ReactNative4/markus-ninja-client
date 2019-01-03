import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'

const mutation = graphql`
  mutation MoveActivityAssetMutation($input: MoveActivityAssetInput!) {
    moveActivityAsset(input: $input) {
      assetEdge {
        node {
          ...ListUserAssetPreview_asset
        }
      }
    }
  }
`

export default (activityId, assetId, afterAssetId, oldActivityNumber, callback) => {
  const variables = {
    input: {
      afterAssetId,
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
        const moveActivityAssetField = proxyStore.getRootField("moveActivityAsset")
        if (moveActivityAssetField) {
          const newAssetEdge = moveActivityAssetField.getLinkedRecord("assetEdge")
          const newAssetNode = newAssetEdge && newAssetEdge.getLinkedRecord("node")
          const newActivityNumber = newAssetNode && newAssetNode.getValue("activityNumber")
          const moveForward = (newActivityNumber - oldActivityNumber) > 0
          const activity = proxyStore.get(activityId)
          if (activity) {
            const activityAssets = ConnectionHandler.getConnection(
              activity,
              "ActivityAssets_assets",
            )
            if (activityAssets) {
              ConnectionHandler.deleteNode(activityAssets, assetId)
              let afterCursor
              const edges = activityAssets.getLinkedRecords("edges")
              for (let edge of edges) {
                const node = edge.getLinkedRecord("node")
                if (node) {
                  const id = node.getValue("id")
                  if (id === afterAssetId) {
                    afterCursor = edge.getValue("cursor")
                  }
                  const activityNumber = node.getValue("activityNumber")
                  if (moveForward && activityNumber > oldActivityNumber && activityNumber <= newActivityNumber) {
                    node.setValue(activityNumber-1, "activityNumber")
                  } else if (!moveForward && activityNumber >= newActivityNumber && activityNumber < oldActivityNumber) {
                    node.setValue(activityNumber+1, "activityNumber")
                  }
                }
              }
              ConnectionHandler.insertEdgeAfter(activityAssets, newAssetEdge, afterCursor)
            }
          }
        }
      },
      onCompleted: callback,
      onError: err => callback(null, err),
    },
  )
}
