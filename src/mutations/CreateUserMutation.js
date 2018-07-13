import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'

const mutation = graphql`
  mutation CreateUserMutation($createUserInput: CreateUserInput! $loginUserInput: LoginUserInput!) {
    createUser(input: $createUserInput) {
      id
    }

    loginUser(input: $loginUserInput) {
      token {
        token
      }
      user {
        id
      }
    }
  }
`

export default (email, login, password, callback) => {
  const variables = {
    createUserInput: {
      email,
      login,
      password,
    },
    loginUserInput: {
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
        callback(response.loginUser.token, error)
      },
      onError: err => console.error(err),
    },
  )
}
