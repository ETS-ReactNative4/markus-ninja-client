import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import {get} from 'utils'

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
        if (appleable) {
          const appleGiverCount = appleable.getLinkedRecord('appleGivers', {first: 0})
          const totalCount = appleGiverCount && appleGiverCount.getValue('totalCount')
          appleGiverCount.setValue(totalCount+1, 'totalCount')
          appleable.setLinkedRecord(appleGiverCount, "appleGivers", {first: 0})
          appleable.setValue(true, 'viewerHasAppled')
        }
      },
      updater: proxyStore => {
        const giveAppleField = proxyStore.getRootField('giveApple')
        if (giveAppleField) {
          const appleGiverCount = giveAppleField.getLinkedRecord('appleGivers', {first: 0})
          const viewerHasAppled = giveAppleField.getValue('viewerHasAppled')

          const appleable = proxyStore.get(appleableId)
          if (appleable) {
            appleable.setLinkedRecord(appleGiverCount, 'appleGivers', {first: 0})
            appleable.setValue(viewerHasAppled, 'viewerHasAppled')
          }
        }
      },
      onCompleted: (response, error) => {
        callback(get(response, 'giveApple.viewerHasAppled', error))
      },
      onError: err => callback(null, err),
    },
  )
}
