import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { get, isNil } from 'utils'

const mutation = graphql`
  mutation LoginUserMutation($input: LoginUserInput!) {
    loginUser(input: $input) {
      token {
        expiresAt
        issuedAt
        token
      }
      user {
        id
        isVerified
        ...Header_viewer
      }
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
      updater: (proxyStore) => {
        const loginUserField = proxyStore.getRootField('loginUser')
        if (!isNil(loginUserField)) {
          const newViewer = loginUserField.getLinkedRecord('user')
          const root = proxyStore.getRoot();
          root.setLinkedRecord(newViewer, 'viewer')
        }
      },
      onCompleted: (response, error) => {
        callback(get(response, "loginUser.token", null), error)
      },
      onError: err => console.error(err),
    },
  )
}
