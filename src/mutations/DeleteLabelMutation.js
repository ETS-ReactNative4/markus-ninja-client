import { ConnectionHandler } from 'relay-runtime'
import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation DeleteLabelMutation($input: DeleteLabelInput!) {
    deleteLabel(input: $input) {
      deletedLabelId
      study {
        id
        labelCount
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
        if (!isNil(deleteLabelField)) {
          const labelStudy = deleteLabelField.getLinkedRecord('study')
          const labelStudyId = labelStudy.getValue('id')
          const searchStudy = ConnectionHandler.getConnection(
            proxyStore.getRoot(),
            "SearchStudy_search",
            {type: "LABEL", within: labelStudyId},
          )

          const studyLabelCount = labelStudy.getValue('labelCount')
          searchStudy && searchStudy.setValue(studyLabelCount, "labelCount")

          const deletedLabelId = deleteLabelField.getValue("deletedLabelId")
          searchStudy && ConnectionHandler.deleteNode(searchStudy, deletedLabelId)

          proxyStore.delete(labelId)
        }
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
