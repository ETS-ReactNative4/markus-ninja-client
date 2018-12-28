import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'
import {get} from 'utils'

const mutation = graphql`
  mutation AddCommentMutation($input: AddCommentInput!) {
    addComment(input: $input) {
      commentEdge {
        node {
          id
          ...Comment_comment
        }
      }
      commentable {
        __typename
        id
        viewerNewComment {
          bodyHTML
          draft
          id
          isPublished
          lastEditedAt
          viewerCanUpdate
        }
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
        const addCommentField = proxyStore.getRootField("addComment")
        if (addCommentField) {
          const commentCommentable = addCommentField.getLinkedRecord("commentable")
          if (commentCommentable) {
            const commentableType = commentCommentable && commentCommentable.getValue("__typename")
            const commentableId = commentCommentable.getValue("id")
            const viewerNewComment = commentCommentable.getLinkedRecord("viewerNewComment")
            const commentable = proxyStore.get(commentableId)
            if (commentable) {
              commentable.setLinkedRecord(viewerNewComment, "viewerNewComment")
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
              const edge = addCommentField.getLinkedRecord("commentEdge")
              timeline && edge && ConnectionHandler.insertEdgeBefore(timeline, edge)
            }
          }
        }
      },
      onCompleted: (response, error) => {
        const comment = get(response, "addComment.commentable.viewerNewComment")
        callback(comment, error)
      },
      onError: err => callback(null, err),
    },
  )
}
