import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import { isNil } from 'utils'

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
      optimisticUpdater: proxyStore => {
        const comment = proxyStore.get(commentId)
        if (comment && !isNil(draft)) {
          comment.setValue(draft, 'draft')
        }
      },
      updater: proxyStore => {
        const updateCommentField = proxyStore.getRootField('updateComment')
        if (!isNil(updateCommentField)) {
          const newDraft = updateCommentField.getValue('draft')
          const newLastEditedAt = updateCommentField.getValue('lastEditedAt')
          const newUpdatedAt = updateCommentField.getValue('updatedAt')

          const comment = proxyStore.get(commentId)
          if (comment) {
            comment.setValue(newDraft, 'draft')
            comment.setValue(newLastEditedAt, 'lastEditedAt')
            comment.setValue(newUpdatedAt, 'updatedAt')
          }
        }
      },
      onCompleted: (response, error) => {
        callback(response.updateComment, error)
      },
      onError: err => callback(null, err),
    },
  )
}
