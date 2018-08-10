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
      lessonTimelineEdge {
        node {
          __typename
          id
          ...on CommentedEvent {
            ...CommentedEvent_event
          }
          ...on ReferencedEvent {
            ...ReferencedEvent_event
          }
        }
      }
    }
  }
`

export default (lessonId, body, callback) => {
  const variables = {
    input: {
      body,
      lessonId,
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
          const lesson = proxyStore.get(lessonId)
          const timeline = ConnectionHandler.getConnection(
            lesson,
            "LessonTimeline_timeline",
          )
          const edge = addLessonCommentField.getLinkedRecord("lessonTimelineEdge")

          ConnectionHandler.insertEdgeBefore(timeline, edge)
        }
      },
      onCompleted: (response, error) => {
        const lessonComment = get(response, "addLessonComment.lessonCommentEdge.node")
        callback(lessonComment, error)
      },
      onError: err => console.error(err),
    },
  )
}
