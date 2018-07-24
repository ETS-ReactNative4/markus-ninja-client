import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation GiveAppleMutation($input: GiveAppleInput!) {
    giveApple(input: $input) {
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
        appleable.setValue(true, 'viewerHasAppled')
      },
      updater: proxyStore => {
        const giveAppleField = proxyStore.getRootField('giveApple')
        if (!isNil(giveAppleField)) {
          const viewerHasAppled = giveAppleField.getValue('viewerHasAppled')

          const appleable = proxyStore.get(appleableId)
          appleable.setValue(viewerHasAppled, 'viewerHasAppled')
        }
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
