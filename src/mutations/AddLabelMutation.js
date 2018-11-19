import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'
import { get, isNil } from 'utils'

const mutation = graphql`
  mutation AddLabelMutation($input: AddLabelInput!) {
    addLabel(input: $input) {
      labelEdge {
        node {
          ...Label_label
        }
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
        if (!isNil(addLabelField)) {
          const labelable = proxyStore.get(labelableId)
          const labels = ConnectionHandler.getConnection(
            labelable,
            "LessonLabels_labels",
          )
          const edge = addLabelField.getLinkedRecord("labelEdge")
          if (edge) {
            ConnectionHandler.insertEdgeAfter(labels, edge)
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
