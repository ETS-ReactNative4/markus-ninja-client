import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'
import {get} from 'utils'

const mutation = graphql`
  mutation RemoveLabelMutation($input: RemoveLabelInput!) {
    removeLabel(input: $input) {
      removedLabelId

      labelable {
        __typename
      }
    }
  }
`

export default (labelId, labelableId, callback) => {
  const variables = {
    input: {
      labelId,
      labelableId,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const removeLabelField = proxyStore.getRootField("removeLabel")
        if (removeLabelField) {
          const labelLabelable = removeLabelField.getLinkedRecord("labelable")
          const labelableType = labelLabelable && labelLabelable.getValue("__typename")
          const labelable = proxyStore.get(labelableId)
          if (labelable) {
            let labels
            switch (labelableType) {
              case "Lesson":
                labels = ConnectionHandler.getConnection(
                  labelable,
                  "LessonLabels_labels",
                )
                break
              case "UserAsset":
                labels = ConnectionHandler.getConnection(
                  labelable,
                  "UserAssetLabels_labels",
                )
                break
              default:
                return
            }
            const removedLabelId = removeLabelField.getValue("removedLabelId")
            labels && removedLabelId && ConnectionHandler.deleteNode(labels, removedLabelId)
          }
        }
      },
      onCompleted: (response, error) => {
        const label = get(response, "removeLabel.removedLabelId")
        callback(label, error)
      },
      onError: err => callback(null, err),
    },
  )
}
