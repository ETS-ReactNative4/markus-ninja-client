import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import {get} from 'utils'

const mutation = graphql`
  mutation UpdateViewerAccountMutation($input: UpdateViewerAccountInput!) {
    updateViewerAccount(input: $input) {
      id
      accountUpdatedAt
      login
      resourcePath
      url
    }
  }
`

export default (login, newPassword, oldPassword, callback) => {
  const variables = {
    input: {
      login,
      newPassword,
      oldPassword,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const updateViewerAccountField = proxyStore.getRootField('updateViewerAccount')
        if (updateViewerAccountField) {
          const userId = updateViewerAccountField.getValue("id")
          const newAccountUpdatedAt = updateViewerAccountField.getValue('accountUpdatedAt')
          const newLogin = updateViewerAccountField.getValue('login')
          const newResourcePath = updateViewerAccountField.getValue('resourcePath')
          const newUrl = updateViewerAccountField.getValue('url')

          const user = proxyStore.get(userId)
          if (user) {
            user.setValue(newAccountUpdatedAt, 'accountUpdatedAt')
            user.setValue(newLogin, 'login')
            user.setValue(newResourcePath, 'resourcePath')
            user.setValue(newUrl, 'url')
          }
        }
      },
      onCompleted: (response, error) => {
        console.log(error)
        callback(get(response, "updateViewerAccount"), error)
      },
      onError: err => callback(null, err),
    },
  )
}
