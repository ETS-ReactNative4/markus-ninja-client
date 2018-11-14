import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'

const mutation = graphql`
  mutation ResetPasswordMutation($input: ResetPasswordInput!) {
    resetPassword(input: $input)
  }
`

export default (email, password, token, callback) => {
  const variables = {
    input: {
      email,
      password,
      token,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      onCompleted: (response, error) => {
        callback(error)
      },
      onError: err => callback(null, err),
    },
  )
}
