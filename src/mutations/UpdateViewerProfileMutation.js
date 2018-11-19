import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'

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
      updater: proxyStore => {
        const updateViewerProfileField = proxyStore.getRootField('updateViewerProfile')
        const userId = updateViewerProfileField.getValue("id")
        const newBio = updateViewerProfileField.getValue('bio')
        const newBioHTML = updateViewerProfileField.getValue('bioHTML')
        const newName = updateViewerProfileField.getValue('name')
        const newProfileUpdatedAt = updateViewerProfileField.getValue('profileUpdatedAt')

        const user = proxyStore.get(userId)
        user.setValue(newBio, 'bio')
        user.setValue(newBioHTML, 'bioHTML')
        user.setValue(newName, 'name')
        user.setValue(newProfileUpdatedAt, 'profileUpdatedAt')
      },
      onCompleted: callback,
      onError: err => callback(null, err),
    },
  )
}
