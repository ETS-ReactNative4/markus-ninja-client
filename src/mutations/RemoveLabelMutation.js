import {
  commitMutation,
  graphql,
} from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation RemoveLabelMutation($input: RemoveLabelInput!) {
    removeLabel(input: $input) {
      removedLabelId
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
        if (!isNil(removeLabelField)) {
          const labelable = proxyStore.get(labelableId)
          const labels = ConnectionHandler.getConnection(
            labelable,
            "LessonLabels_labels",
          )
          const removedLabelId = removeLabelField.getValue("removedLabelId")

          ConnectionHandler.deleteNode(labels, removedLabelId)
        }
      },
      onCompleted: (response, error) => {
        callback(error)
      },
      onError: err => console.error(err),
    },
  )
}
