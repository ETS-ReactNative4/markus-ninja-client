import {
  commitMutation,
  graphql,
} from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation DeleteLessonCommentMutation($input: DeleteLessonCommentInput!) {
    deleteLessonComment(input: $input) {
      deletedLessonCommentId
      deletedLessonTimelineEventId
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
        if (!isNil(deleteLessonCommentField)) {
          const deletedLessonCommentId = deleteLessonCommentField.getValue('deletedLessonCommentId')
          const deletedLessonTimelineEventId = deleteLessonCommentField.getValue('deletedLessonTimelineEventId')
          const lessonId = deleteLessonCommentField.getLinkedRecord('lesson').getValue('id')
          const lesson = proxyStore.get(lessonId)
          const timeline = ConnectionHandler.getConnection(lesson, 'LessonTimeline_timeline')
          ConnectionHandler.deleteNode(timeline, deletedLessonTimelineEventId)
          proxyStore.delete(deletedLessonCommentId)
        }
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
