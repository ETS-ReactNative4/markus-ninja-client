import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import {nullString} from 'utils'

const mutation = graphql`
  mutation PublishCommentDraftMutation($input: PublishCommentDraftInput!) {
    publishCommentDraft(input: $input) {
      id
      body
      bodyHTML
      isPublished
      publishedAt
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
        const publishCommentDraftField = proxyStore.getRootField('publishCommentDraft')
        if (publishCommentDraftField) {
          const newBody = publishCommentDraftField.getValue('body')
          const newBodyHTML = publishCommentDraftField.getValue('bodyHTML')
          const newIsPublished = publishCommentDraftField.getValue('isPublished')
          const newPublishedAt = publishCommentDraftField.getValue('publishedAt')
          const newUpdatedAt = publishCommentDraftField.getValue('updatedAt')

          const comment = proxyStore.get(commentId)
          if (comment) {
            comment.setValue(newBody, 'body')
            comment.setValue(newBodyHTML, 'bodyHTML')
            comment.setValue(newIsPublished, 'isPublished')
            comment.setValue(newPublishedAt, 'publishedAt')
            comment.setValue(newUpdatedAt, 'updatedAt')
          }
        }
      },
      onCompleted: (response, error) => {
        callback(response.publishCommentDraft, error)
      },
      onError: err => callback(null, err),
    },
  )
}
