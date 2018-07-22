import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { getViewerId } from 'auth'

const mutation = graphql`
  mutation DismissMutation($input: DismissInput!) {
    dismiss(input: $input) {
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
        const dismissField = proxyStore.getRootField('dismiss')
        const viewerCanEnroll = dismissField.getValue('viewerCanEnroll')
        const viewerIsEnrolled = dismissField.getValue('viewerIsEnrolled')
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
