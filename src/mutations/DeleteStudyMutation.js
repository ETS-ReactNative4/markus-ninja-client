import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'

const mutation = graphql`
  mutation DeleteStudyMutation($input: DeleteStudyInput!) {
    deleteStudy(input: $input) {
      deletedStudyId
      owner {
        id
      }
    }
  }
`

export default (studyId, callback) => {
  const variables = {
    input: {
      studyId,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const deleteStudyField = proxyStore.getRootField('deleteStudy')
        const deletedStudyId = deleteStudyField.getValue('deletedStudyId')
        // const ownerId = deleteStudyField.getLinkedRecord('owner').getValue('id')

        proxyStore.delete(deletedStudyId)
      },
      onCompleted: callback,
      onError: err => callback(null, err),
    },
  )
}
