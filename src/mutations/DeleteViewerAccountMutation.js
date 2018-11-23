import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'

const mutation = graphql`
  mutation DeleteViewerAccountMutation($input: DeleteViewerAccountInput!) {
    deleteViewerAccount(input: $input) {
      deletedViewerId
    }
  }
`

export default (login, password, callback) => {
  const variables = {
    input: {
      login,
      password,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const deleteViewerAccount = proxyStore.getRootField('deleteViewerAccount')
        const deletedViewerId = deleteViewerAccount.getValue('deletedViewerId')
        proxyStore.delete(deletedViewerId)
      },
      onCompleted: callback,
      onError: err => callback(null, err),
    },
  )
}
