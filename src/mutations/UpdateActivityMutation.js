import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation UpdateActivityMutation($input: UpdateActivityInput!) {
    updateActivity(input: $input) {
      id
      description
      lesson {
        resourcePath
        study {
          nameWithOwner
        }
        title
      }
      name
      updatedAt
    }
  }
`

export default (activityId, description, lessonId, name, callback) => {
  const variables = {
    input: {
      activityId,
      description,
      lessonId,
      name,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      optimisticUpdater: proxyStore => {
        const activity = proxyStore.get(activityId)
        if (!isNil(description)) {
          activity.setValue(description, 'description')
        }
      },
      // updater: proxyStore => {
      //   const updateActivityField = proxyStore.getRootField('updateActivity')
      //   const newDescription = updateActivityField.getValue('description')
      //   const newName = updateActivityField.getValue('name')
      //   const newUpdatedAt = updateActivityField.getValue('updatedAt')
      //
      //   const activity = proxyStore.get(activityId)
      //   activity.setValue(newDescription, 'description')
      //   activity.setValue(newName, 'name')
      //   activity.setValue(newUpdatedAt, 'updatedAt')
      // },
      onCompleted: (response, error) => {
        callback(response.updateActivity, error)
      },
      onError: err => callback(null, err),
    },
  )
}
