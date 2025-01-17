import { ConnectionHandler } from 'relay-runtime'
import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'

const mutation = graphql`
  mutation DeleteLabelMutation($input: DeleteLabelInput!) {
    deleteLabel(input: $input) {
      deletedLabelId
      study {
        id
        labels(first: 0) {
          totalCount
        }
      }
    }
  }
`

export default (labelId, callback) => {
  const variables = {
    input: {
      labelId,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const deleteLabelField = proxyStore.getRootField('deleteLabel')
        if (deleteLabelField) {
          const labelStudy = deleteLabelField.getLinkedRecord('study')
          if (labelStudy) {
            const labelStudyId = labelStudy.getValue('id')
            const study = proxyStore.get(labelStudyId)
            if (study) {
              const studyLabels = ConnectionHandler.getConnection(
                study,
                "StudyLabelsContainer_labels",
              )

              const deletedLabelId = deleteLabelField.getValue("deletedLabelId")
              studyLabels && ConnectionHandler.deleteNode(studyLabels, deletedLabelId)
            }

            proxyStore.delete(labelId)
          }
        }
      },
      onCompleted: callback,
      onError: err => callback(null, err),
    },
  )
}
