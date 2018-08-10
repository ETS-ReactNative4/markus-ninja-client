import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { get } from 'utils'

const mutation = graphql`
  mutation AddEmailMutation($input: AddEmailInput!) {
    addEmail(input: $input) {
      emailEdge {
        node {
          id
          createdAt
          type
          value
        }
      }
      token {
        issuedAt
        expiresAt
      }
      user {
        id
      }
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
        const email = get(response, "addEmail.emailEdge.node")
        callback(email, error)
      },
      onError: err => console.error(err),
    },
  )
}
