import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import {get} from 'utils'

const mutation = graphql`
  mutation UpdateViewerProfileMutation($input: UpdateViewerProfileInput!) {
    updateViewerProfile(input: $input) {
      id
      bio
      bioHTML
      email {
        id
        value
      }
      name
      profileUpdatedAt
    }
  }
`

export default (bio, emailId, name, callback) => {
  const variables = {
    input: {
      bio,
      emailId,
      name,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      onCompleted: (response, error) => callback(get(response, "updateViewerProfile"), error),
      onError: err => callback(null, err),
    },
  )
}
