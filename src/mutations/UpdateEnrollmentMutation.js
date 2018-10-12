import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'

const mutation = graphql`
  mutation UpdateEnrollmentMutation($input: UpdateEnrollmentInput!) {
    updateEnrollment(input: $input) {
      enrollees(first: 0) {
        totalCount
      }
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
        if (enrollable) {
          const enrolleeCount = enrollable.getLinkedRecord('enrollees', {first: 0})
          if (enrolleeCount) {
            let totalCount = enrolleeCount.getValue('totalCount')
            const enrollmentStatus = enrollable.getValue('enrollmentStatus')
            if (enrollmentStatus === 'ENROLLED' &&
              (status === 'IGNORED' || status === 'UNENROLLED')) {
              totalCount--
            } else if ((enrollmentStatus === 'IGNORED' || enrollmentStatus === 'UNENROLLED') &&
              (status === 'ENROLLED')) {
              totalCount++
            }
            enrolleeCount.setValue(totalCount, 'totalCount')

            enrollable.setLinkedRecord(enrolleeCount, 'enrollees', {first: 0})
            enrollable.setValue(status, 'enrollmentStatus')
          }
        }
      },
      updater: proxyStore => {
        const updateEnrollmentField = proxyStore.getRootField('updateEnrollment')
        if (updateEnrollmentField) {
          const enrolleeCount = updateEnrollmentField.getLinkedRecord('enrollees', {first: 0})
          const enrollmentStatus = updateEnrollmentField.getValue('enrollmentStatus')
          const viewerCanEnroll = updateEnrollmentField.getValue('viewerCanEnroll')

          const enrollable = proxyStore.get(enrollableId)
          if (enrollable) {
            enrollable.setLinkedRecord(enrolleeCount, 'enrollees', {first: 0})
            enrollable.setValue(enrollmentStatus, 'enrollmentStatus')
            enrollable.setValue(viewerCanEnroll, 'viewerCanEnroll')
          }
        }
      },
      onCompleted: (response, error) => callback(error),
      onError: err => console.error(err),
    },
  )
}
