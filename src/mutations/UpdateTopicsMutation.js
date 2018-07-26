import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'

const mutation = graphql`
  mutation UpdateTopicsMutation($input: UpdateTopicsInput!) {
    updateTopics(input: $input) {
      invalidTopicNames
      message
    }
  }
`

export default (topicableId, topicNames, callback) => {
  const variables = {
    input: {
      topicableId,
      topicNames,
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
