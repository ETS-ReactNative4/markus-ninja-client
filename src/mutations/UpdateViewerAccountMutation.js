import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
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
      onCompleted: (response, error) => {
        console.log(error)
        callback(get(response, "updateViewerAccount"), error)
      },
      onError: err => callback(null, err),
    },
  )
}
