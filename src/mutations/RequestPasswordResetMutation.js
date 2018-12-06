import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
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
        callback(response.requestPasswordReset, error)
      },
      onError: err => callback(null, err),
    },
  )
}
