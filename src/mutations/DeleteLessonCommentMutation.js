import {
  commitMutation,
  graphql,
} from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'

const mutation = graphql`
  mutation DeleteLessonCommentMutation($input: DeleteLessonCommentInput!) {
    deleteLessonComment(input: $input) {
      deletedLessonCommentId
      deletedLessonTimelineEdgeId
      lesson {
        id
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
        const deleteLessonCommentField = proxyStore.getRootField('deleteLessonComment')
        const deletedLessonCommentId = deleteLessonCommentField.getValue('deletedLessonCommentId')
        const deletedLessonTimelineEdgeId = deleteLessonCommentField.getValue('deletedLessonTimelineEdgeId')
        const lessonId = deleteLessonCommentField.getLinkedRecord('lesson').getValue('id')
        const lesson = proxyStore.get(lessonId)
        const timeline = ConnectionHandler.getConnection(lesson, 'LessonTimeline_timeline')
        ConnectionHandler.deleteNode(timeline, deletedLessonTimelineEdgeId)
        proxyStore.delete(deletedLessonCommentId)
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
