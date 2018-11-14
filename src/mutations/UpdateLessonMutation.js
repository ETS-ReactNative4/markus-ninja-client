import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import {nullString} from 'utils'

const mutation = graphql`
  mutation UpdateLessonMutation($input: UpdateLessonInput!) {
    updateLesson(input: $input) {
      id
      draft
      lastEditedAt
      title
      updatedAt
    }
  }
`

export default (lessonId, title, draft, callback) => {
  const variables = {
    input: {
      draft,
      lessonId: nullString(lessonId),
      title: nullString(title),
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      optimisticUpdater: proxyStore => {
        const lesson = proxyStore.get(lessonId)
        if (lesson) {
          if (draft) {
            lesson.setValue(draft, 'draft')
          }
          if (title) {
            lesson.setValue(title, 'title')
          }
        }
      },
      updater: proxyStore => {
        const updateLessonField = proxyStore.getRootField('updateLesson')
        if (updateLessonField) {
          const newDraft = updateLessonField.getValue('draft')
          const newLastEditedAt = updateLessonField.getValue('lastEditedAt')
          const newTitle = updateLessonField.getValue('title')
          const newUpdatedAt = updateLessonField.getValue('updatedAt')

          const lesson = proxyStore.get(lessonId)
          if (lesson) {
            lesson.setValue(newDraft, 'draft')
            lesson.setValue(newLastEditedAt, 'lastEditedAt')
            lesson.setValue(newTitle, 'title')
            lesson.setValue(newUpdatedAt, 'updatedAt')
          }
        }
      },
      onCompleted: (response, error) => {
        callback(response.updateLesson, error)
      },
      onError: err => callback(null, err),
    },
  )
}
