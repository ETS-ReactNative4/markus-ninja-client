import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'

const mutation = graphql`
  mutation MarkNotificationAsReadMutation($input: MarkNotificationAsReadInput!) {
    markNotificationAsRead(input: $input)
  }
`

export default (notificationId, callback) => {
  const variables = {
    input: {
      notificationId,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        // const markNotificationAsReadField = proxyStore.getRootField('markNotificationAsRead')
      },
      onCompleted: callback,
      onError: err => callback(null, err),
    },
  )
}
