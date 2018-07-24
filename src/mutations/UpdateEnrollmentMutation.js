import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation UpdateEnrollmentMutation($input: UpdateEnrollmentInput!) {
    updateEnrollment(input: $input) {
      enrollmentStatus
      id
      viewerCanEnroll
    }
  }
`

export default (enrollableId, status, callback) => {
  const variables = {
    input: {
      enrollableId,
      status,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const updateEnrollmentField = proxyStore.getRootField('updateEnrollment')
        if (!isNil(updateEnrollmentField)) {
          const enrollmentStatus = updateEnrollmentField.getValue('enrollmentStatus')
          const viewerCanEnroll = updateEnrollmentField.getValue('viewerCanEnroll')

          const enrollable = proxyStore.get(enrollableId)
          enrollable.setValue(enrollmentStatus, 'enrollmentStatus')
          enrollable.setValue(viewerCanEnroll, 'viewerCanEnroll')
        }
      },
      onCompleted: (response, error) => callback(error),
      onError: err => console.error(err),
    },
  )
}
