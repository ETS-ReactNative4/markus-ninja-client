import {
  commitMutation,
  graphql,
} from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'
import { get, isNil } from 'utils'

const mutation = graphql`
  mutation AddLessonCommentMutation($input: AddLessonCommentInput!) {
    addLessonComment(input: $input) {
      commentEdge {
        node {
          id
          ...LessonComment_comment
        }
      }
      lesson {
        id
        viewerNewComment {
          draft
          id
          lastEditedAt
        }
      }
    }
  }
`

export default (lessonCommentId, callback) => {
  const variables = {
    input: {
      lessonCommentId,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const addLessonCommentField = proxyStore.getRootField("addLessonComment")
        if (!isNil(addLessonCommentField)) {
          const commentLesson = addLessonCommentField.getLinkedRecord("lesson")
          if (commentLesson) {
            const commentLessonId = commentLesson.getValue("id")
            const viewerNewComment = commentLesson.getLinkedRecord("viewerNewComment")
            const lesson = proxyStore.get(commentLessonId)
            if (lesson) {
              lesson.setLinkedRecord(viewerNewComment, "viewerNewComment")
              const timeline = ConnectionHandler.getConnection(
                lesson,
                "LessonTimeline_timeline",
              )
              const edge = addLessonCommentField.getLinkedRecord("commentEdge")

              ConnectionHandler.insertEdgeBefore(timeline, edge)
            }
          }
        }
      },
      onCompleted: (response, error) => {
        const lessonComment = get(response, "addLessonComment.commentEdge.node")
        callback(lessonComment, error)
      },
      onError: err => callback(null, err),
    },
  )
}
