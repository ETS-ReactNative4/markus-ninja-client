import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation TakeAppleMutation($input: TakeAppleInput!) {
    takeApple(input: $input) {
      appleGivers(first: 0) {
        totalCount
      }
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
        const appleGivers = appleable.getLinkedRecord('appleGivers', {first: 0})
        const totalCount = appleGivers.getValue('totalCount')
        appleGivers.setValue(totalCount-1, 'totalCount')
        appleable.setValue(false, 'viewerHasAppled')
      },
      updater: proxyStore => {
        const takeAppleField = proxyStore.getRootField('takeApple')
        if (!isNil(takeAppleField)) {
          const appleGivers = takeAppleField.getLinkedRecord('appleGivers', {first: 0})
          const viewerHasAppled = takeAppleField.getValue('viewerHasAppled')

          const appleable = proxyStore.get(appleableId)
          appleable.setLinkedRecord(appleGivers, 'appleGivers', {first: 0})
          appleable.setValue(viewerHasAppled, 'viewerHasAppled')
        }
      },
      onCompleted: (response, error) => {
        callback(error)
      },
      onError: err => console.error(err),
    },
  )
}
