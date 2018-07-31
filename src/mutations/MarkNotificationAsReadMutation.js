import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation MarkNotificationAsReadMutation($input: MarkNotificationAsReadInput!) {
    markNotificationAsRead(input: $input) {
      node {
        id
        lastReadAt
      }
    }
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
        const markNotificationAsReadField = proxyStore.getRootField('markNotificationAsRead')
        if (!isNil(markNotificationAsReadField)) {
          // const lastReadAt = markNotificationAsReadField.getValue('lastReadAt')
//
          // const notification = proxyStore.get(notificationId)
          // notification.setValue(lastReadAt, 'lastReadAt')
        }
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
