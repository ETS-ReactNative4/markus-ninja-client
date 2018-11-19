import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
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
