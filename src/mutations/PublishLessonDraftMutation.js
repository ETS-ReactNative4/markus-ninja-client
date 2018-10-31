import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import {nullString} from 'utils'

const mutation = graphql`
  mutation PublishLessonDraftMutation($input: PublishLessonDraftInput!) {
    publishLessonDraft(input: $input) {
      id
      body
      bodyHTML
      publishedAt
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
        const publishLessonDraftField = proxyStore.getRootField('publishLessonDraft')
        if (publishLessonDraftField) {
          const newBody = publishLessonDraftField.getValue('body')
          const newBodyHTML = publishLessonDraftField.getValue('bodyHTML')
          const newPublishedAt = publishLessonDraftField.getValue('publishedAt')
          const newUpdatedAt = publishLessonDraftField.getValue('updatedAt')

          const lesson = proxyStore.get(lessonId)
          if (lesson) {
            lesson.setValue(newBody, 'body')
            lesson.setValue(newBodyHTML, 'bodyHTML')
            lesson.setValue(newPublishedAt, 'publishedAt')
            lesson.setValue(newUpdatedAt, 'updatedAt')
          }
        }
      },
      onCompleted: (response, error) => {
        callback(response.publishLessonDraft, error)
      },
      onError: err => console.error(err),
    },
  )
}
