import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation UpdateLessonCommentMutation($input: UpdateLessonCommentInput!) {
    updateLessonComment(input: $input) {
      id
      body
      bodyHTML
      updatedAt
    }
  }
`

export default (lessonCommentId, body, callback) => {
  const variables = {
    input: {
      body,
      lessonCommentId,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      optimisticUpdater: proxyStore => {
        const lessonComment = proxyStore.get(lessonCommentId)
        if (!isNil(body)) {
          lessonComment.setValue(body, 'body')
        }
      },
      updater: proxyStore => {
        const updateLessonCommentField = proxyStore.getRootField('updateLessonComment')
        if (!isNil(updateLessonCommentField)) {
          const newBody = updateLessonCommentField.getValue('body')
          const newBodyHTML = updateLessonCommentField.getValue('bodyHTML')
          const newUpdatedAt = updateLessonCommentField.getValue('updatedAt')

          const lessonComment = proxyStore.get(lessonCommentId)
          lessonComment.setValue(newBody, 'body')
          lessonComment.setValue(newBodyHTML, 'bodyHTML')
          lessonComment.setValue(newUpdatedAt, 'updatedAt')
        }
      },
      onCompleted: (response, error) => {
        callback(response.updateLessonComment, error)
      },
      onError: err => console.error(err),
    },
  )
}
