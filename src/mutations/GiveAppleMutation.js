import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { get, isNil } from 'utils'

const mutation = graphql`
  mutation GiveAppleMutation($input: GiveAppleInput!) {
    giveApple(input: $input) {
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
        appleGivers.setValue(totalCount+1, 'totalCount')
        appleable.setValue(true, 'viewerHasAppled')
      },
      updater: proxyStore => {
        const giveAppleField = proxyStore.getRootField('giveApple')
        if (!isNil(giveAppleField)) {
          const appleGivers = giveAppleField.getLinkedRecord('appleGivers', {first: 0})
          const viewerHasAppled = giveAppleField.getValue('viewerHasAppled')

          const appleable = proxyStore.get(appleableId)
          appleable.setLinkedRecord(appleGivers, 'appleGivers', {first: 0})
          appleable.setValue(viewerHasAppled, 'viewerHasAppled')
        }
      },
      onCompleted: (response, error) => {
        callback(get(response, 'giveApple.viewerHasAppled', error))
      },
      onError: err => console.error(err),
    },
  )
}
