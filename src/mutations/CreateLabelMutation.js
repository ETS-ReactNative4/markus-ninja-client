import { ConnectionHandler } from 'relay-runtime'
import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation CreateLabelMutation($input: CreateLabelInput!) {
    createLabel(input: $input) {
      labelEdge {
        node {
          id
          ...ListLabelPreview_label
        }
      }
      study {
        id
        labels(first: 0) {
          totalCount
        }
      }
    }
  }
`

export default (studyId, name, description, color, callback) => {
  const variables = {
    input: {
      color,
      description,
      name,
      studyId,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const createLabelField = proxyStore.getRootField('createLabel')
        if (!isNil(createLabelField)) {
          const study = proxyStore.get(studyId)
          if (study) {
            const studyLabels = ConnectionHandler.getConnection(
              study,
              "StudyLabelsContainer_labels",
            )

            const labelEdge = createLabelField.getLinkedRecord('labelEdge')
            studyLabels && ConnectionHandler.insertEdgeBefore(studyLabels, labelEdge)
          }
        }
      },
      onCompleted: callback,
      onError: err => callback(null, err),
    },
  )
}
