import { ConnectionHandler } from 'relay-runtime'
import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation CreateLabelMutation($input: CreateLabelInput!) {
    createLabel(input: $input) {
      labelEdge {
        node {
          ...LabelPreview_label
        }
      }
      study {
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
          const labelStudy = createLabelField.getLinkedRecord('study')
          const labelStudyLabels = labelStudy.getLinkedRecord('labels', {first: 0})
          const study = proxyStore.get(studyId)
          study.setLinkedRecord(labelStudyLabels, 'labels', {first: 0})

          const labelEdge = createLabelField.getLinkedRecord('labelEdge')
          const studyLabels = ConnectionHandler.getConnection(
            study,
            "StudyLabels_labels",
          )
          studyLabels && ConnectionHandler.insertEdgeBefore(studyLabels, labelEdge)
          const searchLabels = ConnectionHandler.getConnection(
            proxyStore.getRoot(),
            "SearchStudyLabels_search",
          )
          searchLabels && ConnectionHandler.insertEdgeBefore(searchLabels, labelEdge)
        }
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
