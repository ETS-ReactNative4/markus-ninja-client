import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'
import {get} from 'utils'

const mutation = graphql`
  mutation DeleteCommentMutation($input: DeleteCommentInput!) {
    deleteComment(input: $input) {
      deletedCommentId
      commentable {
        __typename
        id
      }
    }
  }
`

export default (commentId, callback) => {
  const variables = {
    input: {
      commentId,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const deleteCommentField = proxyStore.getRootField('deleteComment')
        if (deleteCommentField) {
          const commentCommentable = deleteCommentField.getLinkedRecord('commentable')
          const commentableId = commentCommentable && commentCommentable.getValue('id')
          const commentableType = commentCommentable && commentCommentable.getValue('__typename')
          const commentable = proxyStore.get(commentableId)
          if (commentable) {
            let timeline
            switch (commentableType) {
              case "Lesson":
                timeline = ConnectionHandler.getConnection(
                  commentable,
                  "LessonTimeline_timeline",
                )
                break
              case "UserAsset":
                timeline = ConnectionHandler.getConnection(
                  commentable,
                  "UserAssetTimeline_timeline",
                )
                break
              default:
                return
            }
            const deletedCommentId = deleteCommentField.getValue('deletedCommentId')
            timeline && deletedCommentId && ConnectionHandler.deleteNode(timeline, deletedCommentId)
          }
        }
      },
      onCompleted: (response, error) => {
        const deletedCommentId = get(response, "deleteComment.deletedCommentId")
        callback(deletedCommentId, error)
      },
      onError: err => callback(null, err),
    },
  )
}
