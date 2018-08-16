import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation LogoutUserMutation {
    logoutUser {
      loggedOutUserId
    }
  }
`

export default (callback) => {
  commitMutation(
    environment,
    {
      mutation,
      updater: (proxyStore) => {
        const logoutUserField = proxyStore.getRootField('logoutUser')
        if (!isNil(logoutUserField)) {
          const loggedOutUserId = logoutUserField.getValue('loggedOutUserId')
          proxyStore.delete(loggedOutUserId)
        }
      },
      onCompleted: (response, error) => {
        callback(error)
      },
      onError: err => console.error(err),
    },
  )
}
