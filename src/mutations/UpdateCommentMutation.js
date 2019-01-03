import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'

const mutation = graphql`
  mutation UpdateCommentMutation($input: UpdateCommentInput!) {
    updateComment(input: $input) {
      id
      draft
      lastEditedAt
      updatedAt
    }
  }
`

export default (commentId, draft, callback) => {
  const variables = {
    input: {
      draft,
      commentId,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      onCompleted: (response, error) => {
        callback(response.updateComment, error)
      },
      onError: err => callback(null, err),
    },
  )
}
