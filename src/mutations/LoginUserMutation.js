import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { get } from 'utils'

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
      onCompleted: (response, error) => {
        callback(get(response, "loginUser.token", null), error)
      },
      onError: err => console.error(err),
    },
  )
}
