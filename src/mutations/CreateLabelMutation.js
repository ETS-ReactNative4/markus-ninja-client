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
          id
          ...LabelPreview_label
        }
      }
      study {
        labelCount
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
          const searchStudy = ConnectionHandler.getConnection(
            proxyStore.getRoot(),
            "SearchContainer_search",
            {type: "LABEL", within: studyId},
          )

          const labelStudy = createLabelField.getLinkedRecord('study')
          const studyLabelCount = labelStudy.getValue('labelCount')
          searchStudy && searchStudy.setValue(studyLabelCount, "labelCount")

          const labelEdge = createLabelField.getLinkedRecord('labelEdge')
          searchStudy && ConnectionHandler.insertEdgeBefore(searchStudy, labelEdge)
        }
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
