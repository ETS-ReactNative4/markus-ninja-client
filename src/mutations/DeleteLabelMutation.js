import { ConnectionHandler } from 'relay-runtime'
import {
  commitMutation,
  graphql,
} from 'react-relay'
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
            const searchStudy = ConnectionHandler.getConnection(
              proxyStore.getRoot(),
              "SearchStudy_search",
              {type: "LABEL", within: labelStudyId},
            )

            const studyLabelCount = labelStudy.getLinkedRecord('labels', {first: 0})
            searchStudy && searchStudy.setValue(studyLabelCount, "labels", {first: 0})

            const deletedLabelId = deleteLabelField.getValue("deletedLabelId")
            searchStudy && ConnectionHandler.deleteNode(searchStudy, deletedLabelId)

            proxyStore.delete(labelId)
          }
        }
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
