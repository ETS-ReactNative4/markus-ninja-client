import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'

const mutation = graphql`
  mutation RequestPasswordResetMutation($input: RequestPasswordResetInput!) {
    requestPasswordReset(input: $input) {
      expiresAt
      issuedAt
    }
  }
`

export default (email, callback) => {
  const variables = {
    input: {
      email,
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
      onError: err => console.error(err),
    },
  )
}
