import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import {nullString} from 'utils'

const mutation = graphql`
  mutation ResetLessonCommentDraftMutation($input: ResetLessonCommentDraftInput!) {
    resetLessonCommentDraft(input: $input) {
      id
      draft
      lastEditedAt
      updatedAt
    }
  }
`

export default (lessonCommentId, callback) => {
  const variables = {
    input: {
      lessonCommentId: nullString(lessonCommentId),
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const resetLessonCommentDraftField = proxyStore.getRootField('resetLessonCommentDraft')
        if (resetLessonCommentDraftField) {
          const newDraft = resetLessonCommentDraftField.getValue('draft')
          const newLastEditedAt = resetLessonCommentDraftField.getValue('lastEditedAt')
          const newUpdatedAt = resetLessonCommentDraftField.getValue('updatedAt')

          const comment = proxyStore.get(lessonCommentId)
          if (comment) {
            comment.setValue(newDraft, 'draft')
            comment.setValue(newLastEditedAt, 'lastEditedAt')
            comment.setValue(newUpdatedAt, 'updatedAt')
          }
        }
      },
      onCompleted: (response, error) => {
        callback(response.resetLessonCommentDraft, error)
      },
      onError: err => callback(null, err),
    },
  )
}
