import {
  commitMutation,
  graphql,
} from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'
import { get, isNil } from 'utils'

const mutation = graphql`
  mutation AddLessonCommentMutation($input: AddLessonCommentInput!, $filename: String!) {
    addLessonComment(input: $input) {
      commentEdge {
        node {
          id
          ...LessonComment_comment
        }
      }
    }
  }
`

export default (lessonId, body, callback) => {
  const variables = {
    filename: "",
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
          const edge = addLessonCommentField.getLinkedRecord("commentEdge")

          ConnectionHandler.insertEdgeBefore(timeline, edge)
        }
      },
      onCompleted: (response, error) => {
        const lessonComment = get(response, "addLessonComment.commentEdge.node")
        callback(lessonComment, error)
      },
      onError: err => console.error(err),
    },
  )
}
