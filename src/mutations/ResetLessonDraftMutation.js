import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import {nullString} from 'utils'

const mutation = graphql`
  mutation ResetLessonDraftMutation($input: ResetLessonDraftInput!) {
    resetLessonDraft(input: $input) {
      id
      draft
      lastEditedAt
      updatedAt
    }
  }
`

export default (lessonId, callback) => {
  const variables = {
    input: {
      lessonId: nullString(lessonId),
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const resetLessonDraftField = proxyStore.getRootField('resetLessonDraft')
        if (resetLessonDraftField) {
          const newDraft = resetLessonDraftField.getValue('draft')
          const newLastEditedAt = resetLessonDraftField.getValue('lastEditedAt')
          const newUpdatedAt = resetLessonDraftField.getValue('updatedAt')

          const lesson = proxyStore.get(lessonId)
          if (lesson) {
            lesson.setValue(newDraft, 'draft')
            lesson.setValue(newLastEditedAt, 'lastEditedAt')
            lesson.setValue(newUpdatedAt, 'updatedAt')
          }
        }
      },
      onCompleted: (response, error) => {
        callback(response.resetLessonDraft, error)
      },
      onError: err => console.error(err),
    },
  )
}
