import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'
import {get} from 'utils'

const mutation = graphql`
  mutation AddLabelMutation($input: AddLabelInput!) {
    addLabel(input: $input) {
      labelEdge {
        node {
          ...Label_label
        }
      }
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
        const addLabelField = proxyStore.getRootField("addLabel")
        if (addLabelField) {
          const labelLabelable = addLabelField.getLinkedRecord("labelable")
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
            const edge = addLabelField.getLinkedRecord("labelEdge")
            labels && edge && ConnectionHandler.insertEdgeAfter(labels, edge)
          }
        }
      },
      onCompleted: (response, error) => {
        const label = get(response, "addLabel.labelEdge.node")
        callback(label, error)
      },
      onError: err => callback(null, err),
    },
  )
}
