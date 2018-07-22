import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { getViewerId } from 'auth'

const mutation = graphql`
  mutation EnrollMutation($input: EnrollInput!) {
    enroll(input: $input) {
      id
      viewerCanEnroll
      viewerIsEnrolled
    }
  }
`

export default (enrollableId, callback) => {
  const variables = {
    input: {
      enrollableId,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const enrollField = proxyStore.getRootField('enroll')
        const viewerCanEnroll = enrollField.getValue('viewerCanEnroll')
        const viewerIsEnrolled = enrollField.getValue('viewerIsEnrolled')
        const viewerId = getViewerId()

        const viewer = proxyStore.get(viewerId)
        viewer.setValue(viewerCanEnroll, 'viewerCanEnroll')
        viewer.setValue(viewerIsEnrolled, 'viewerIsEnrolled')
      },
      onCompleted: (response, error) => callback(error),
      onError: err => console.error(err),
    },
  )
}
