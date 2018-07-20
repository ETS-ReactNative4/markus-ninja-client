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
      viewerHasEnrolled
      ... on User {
        viewerCanEnroll
      }
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
        const viewerHasEnrolled = dismissField.getValue('viewerHasEnrolled')
        const viewerCanEnroll = dismissField.getValue('viewerCanEnroll')
        const viewerId = getViewerId()

        const viewer = proxyStore.get(viewerId)
        viewer.setValue(viewerHasEnrolled, 'viewerHasEnrolled')
        viewer.setValue(viewerCanEnroll, 'viewerCanEnroll')
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
