import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation TakeAppleMutation($input: TakeAppleInput!) {
    takeApple(input: $input) {
      id
      viewerHasAppled
    }
  }
`

export default (appleableId, callback) => {
  const variables = {
    input: {
      appleableId,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      optimisticUpdater: proxyStore => {
        const appleable = proxyStore.get(appleableId)
        appleable.setValue(false, 'viewerHasAppled')
      },
      updater: proxyStore => {
        const takeAppleField = proxyStore.getRootField('takeApple')
        if (!isNil(takeAppleField)) {
          const viewerHasAppled = takeAppleField.getValue('viewerHasAppled')

          const appleable = proxyStore.get(appleableId)
          appleable.setValue(viewerHasAppled, 'viewerHasAppled')
        }
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
