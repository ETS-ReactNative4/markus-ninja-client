import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation UpdateLabelMutation($input: UpdateLabelInput!) {
    updateLabel(input: $input) {
      id
      ...ListLabelPreview_label
    }
  }
`

export default (labelId, color, description, callback) => {
  const variables = {
    input: {
      color,
      description,
      labelId,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      optimisticUpdater: proxyStore => {
        const label = proxyStore.get(labelId)
        if (label) {
          label.setValue(color, "color")
          label.setValue(description, "description")
        }
      },
      updater: proxyStore => {
        const updateLabelField = proxyStore.getRootField('updateLabel')
        if (!isNil(updateLabelField)) {
          const updatedLabelEdge = updateLabelField.getLinkedRecord("labelEdge")
          if (updatedLabelEdge) {
            const newColor = updatedLabelEdge.getValue("color")
            const newDescription = updatedLabelEdge.getValue("description")
            const label = proxyStore.get(labelId)
            if (label) {
              label.setValue(newColor, "color")
              label.setValue(newDescription, "description")
            }
          }
        }
      },
      onCompleted: callback,
      onError: err => callback(null, err),
    },
  )
}
