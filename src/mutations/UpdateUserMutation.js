import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'

const mutation = graphql`
  mutation UpdateUserMutation($input: UpdateViewerInput!) {
    updateViewer(input: $input) {
      id
      bio
      bioHTML
      updatedAt
    }
  }
`

export default (bio, callback) => {
  const variables = {
    input: {
      bio,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const updateUserField = proxyStore.getRootField('updateUser')
        const userId = updateUserField.getValue("id")
        const newBody = updateUserField.getValue('bio')
        const newBodyHTML = updateUserField.getValue('bioHTML')
        const newUpdatedAt = updateUserField.getValue('updatedAt')

        const user = proxyStore.get(userId)
        user.setValue(newBody, 'bio')
        user.setValue(newBodyHTML, 'bioHTML')
        user.setValue(newUpdatedAt, 'updatedAt')
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
