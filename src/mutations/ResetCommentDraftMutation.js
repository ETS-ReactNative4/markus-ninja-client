import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import {nullString} from 'utils'

const mutation = graphql`
  mutation ResetCommentDraftMutation($input: ResetCommentDraftInput!) {
    resetCommentDraft(input: $input) {
      id
      draft
      lastEditedAt
      updatedAt
    }
  }
`

export default (commentId, callback) => {
  const variables = {
    input: {
      commentId: nullString(commentId),
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const resetCommentDraftField = proxyStore.getRootField('resetCommentDraft')
        if (resetCommentDraftField) {
          const newDraft = resetCommentDraftField.getValue('draft')
          const newLastEditedAt = resetCommentDraftField.getValue('lastEditedAt')
          const newUpdatedAt = resetCommentDraftField.getValue('updatedAt')

          const comment = proxyStore.get(commentId)
          if (comment) {
            comment.setValue(newDraft, 'draft')
            comment.setValue(newLastEditedAt, 'lastEditedAt')
            comment.setValue(newUpdatedAt, 'updatedAt')
          }
        }
      },
      onCompleted: (response, error) => {
        callback(response.resetCommentDraft, error)
      },
      onError: err => callback(null, err),
    },
  )
}
