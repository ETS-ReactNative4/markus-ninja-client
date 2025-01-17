import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'

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

export default (topicId, description, callback) => {
  const variables = {
    input: {
      topicId,
      description,
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
