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
        if (!isNil(deleteLabelField)) {
          const labelStudy = deleteLabelField.getLinkedRecord('study')
          const labelStudyId = labelStudy.getValue('id')
          const labelStudyLabels = labelStudy.getLinkedRecord('labels', {first: 0})
          const study = proxyStore.get(labelStudyId)
          study.setLinkedRecord(labelStudyLabels, 'labels', {first: 0})

          const labelEdge = deleteLabelField.getLinkedRecord('labelEdge')
          const studyLabels = ConnectionHandler.getConnection(
            study,
            "StudyLabels_labels",
          )
          studyLabels && ConnectionHandler.deleteNode(studyLabels, labelEdge)
          const searchLabels = ConnectionHandler.getConnection(
            proxyStore.getRoot(),
            "SearchStudyLabels_search",
          )
          searchLabels && ConnectionHandler.deleteNode(searchLabels, labelEdge)

          proxyStore.delete(labelId)
        }
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
