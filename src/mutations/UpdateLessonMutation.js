import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { isEmpty, isNil, nullString } from 'utils'

const mutation = graphql`
  mutation UpdateLessonMutation($input: UpdateLessonInput!) {
    updateLesson(input: $input) {
      id
      body
      bodyHTML
      title
      updatedAt
    }
  }
`

export default (lessonId, title, body, callback) => {
  const variables = {
    input: {
      body,
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
        if (!isNil(body)) {
          lesson.setValue(body, 'body')
        }
        if (!isEmpty(title)) {
          lesson.setValue(title, 'title')
        }
      },
      updater: proxyStore => {
        const updateLessonField = proxyStore.getRootField('updateLesson')
        const newBody = updateLessonField.getValue('body')
        const newBodyHTML = updateLessonField.getValue('bodyHTML')
        const newTitle = updateLessonField.getValue('title')
        const newUpdatedAt = updateLessonField.getValue('updatedAt')

        const lesson = proxyStore.get(lessonId)
        lesson.setValue(newBody, 'body')
        lesson.setValue(newBodyHTML, 'bodyHTML')
        lesson.setValue(newTitle, 'title')
        lesson.setValue(newUpdatedAt, 'updatedAt')
      },
      onCompleted: (response, error) => {
        callback(response.updateLesson, error)
      },
      onError: err => console.error(err),
    },
  )
}
