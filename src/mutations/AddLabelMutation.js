import {
  commitMutation,
  graphql,
} from 'react-relay'
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
            "LessonHeader_labels",
          )
          const edge = addLabelField.getLinkedRecord("labelEdge")

          ConnectionHandler.insertEdgeAfter(labels, edge)
        }
      },
      onCompleted: (response, error) => {
        const label = get(response, "addLabel.labelEdge.node")
        callback(label, error)
      },
      onError: err => console.error(err),
    },
  )
}
