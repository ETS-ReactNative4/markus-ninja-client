import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation UpdateEnrollmentMutation($input: UpdateEnrollmentInput!) {
    updateEnrollment(input: $input) {
      enrolleeCount
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
      optimisticUpdater: proxyStore => {
        const enrollable = proxyStore.get(enrollableId)
        let enrolleeCount = enrollable.getValue('enrolleeCount')
        const enrollmentStatus = enrollable.getValue('enrollmentStatus')
        if (enrollmentStatus === 'ENROLLED' &&
          (status === 'IGNORED' || status === 'UNENROLLED')) {
          enrolleeCount--
        } else if ((enrollmentStatus === 'IGNORED' || enrollmentStatus === 'UNENROLLED') &&
          (status === 'ENROLLED')) {
          enrolleeCount++
        }

        enrollable && enrollable.setValue(enrolleeCount, 'enrolleeCount')
      },
      updater: proxyStore => {
        const updateEnrollmentField = proxyStore.getRootField('updateEnrollment')
        if (!isNil(updateEnrollmentField)) {
          const enrolleeCount = updateEnrollmentField.getValue('enrolleeCount')
          const enrollmentStatus = updateEnrollmentField.getValue('enrollmentStatus')
          const viewerCanEnroll = updateEnrollmentField.getValue('viewerCanEnroll')

          const enrollable = proxyStore.get(enrollableId)
          enrollable.setValue(enrolleeCount, 'enrolleeCount')
          enrollable.setValue(enrollmentStatus, 'enrollmentStatus')
          enrollable.setValue(viewerCanEnroll, 'viewerCanEnroll')
        }
      },
      onCompleted: (response, error) => callback(error),
      onError: err => console.error(err),
    },
  )
}
