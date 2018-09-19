import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation UpdateTopicMutation($input: UpdateTopicInput!) {
    updateTopic(input: $input) {
      id
      description
      resourcePath
      url
      updatedAt
    }
  }
`

export default (topicId, description, name, callback) => {
  const variables = {
    input: {
      topicId,
      description,
      name,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      optimisticUpdater: proxyStore => {
        const topic = proxyStore.get(topicId)
        if (!isNil(description)) {
          topic.setValue(description, 'description')
        }
      },
      updater: proxyStore => {
        const updateTopicField = proxyStore.getRootField('updateTopic')
        const newDescription = updateTopicField.getValue('description')
        const newResourcePath = updateTopicField.getValue('resourcePath')
        const newUrl = updateTopicField.getValue('url')
        const newUpdatedAt = updateTopicField.getValue('updatedAt')

        const topic = proxyStore.get(topicId)
        topic.setValue(newDescription, 'description')
        topic.setValue(newResourcePath, 'resourcePath')
        topic.setValue(newUrl, 'url')
        topic.setValue(newUpdatedAt, 'updatedAt')
      },
      onCompleted: (response, error) => {
        callback(error)
      },
      onError: err => console.error(err),
    },
  )
}