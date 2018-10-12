import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import {get} from 'utils'

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
        if (appleable) {
          const appleGiverCount = appleable.getLinkedRecord('appleGivers', {first: 0})
          const totalCount = appleGiverCount && appleGiverCount.getValue('totalCount')
          appleGiverCount.setValue(totalCount-1, 'totalCount')
          appleable.setLinkedRecord(appleGiverCount, "appleGivers", {first: 0})
          appleable.setValue(false, 'viewerHasAppled')
        }
      },
      updater: proxyStore => {
        const takeAppleField = proxyStore.getRootField('takeApple')
        if (takeAppleField) {
          const appleGiverCount = takeAppleField.getLinkedRecord('appleGivers', {first: 0})
          const viewerHasAppled = takeAppleField.getValue('viewerHasAppled')

          const appleable = proxyStore.get(appleableId)
          if (appleable) {
            appleable.setLinkedRecord(appleGiverCount, 'appleGivers', {first: 0})
            appleable.setValue(viewerHasAppled, 'viewerHasAppled')
          }
        }
      },
      onCompleted: (response, error) => {
        callback(get(response, 'takeApple.viewerHasAppled', error))
      },
      onError: err => console.error(err),
    },
  )
}
