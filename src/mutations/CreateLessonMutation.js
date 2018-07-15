import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'

const mutation = graphql`
  mutation CreateLessonMutation($input: CreateLessonInput!) {
    createLesson(input: $input) {
      id
      body
      createdAt
      number
      resourcePath
      study {
        id
        advancedAt
      }
      title
    }
  }
`

export default (studyId, title, body, callback) => {
  const variables = {
    input: {
      body,
      studyId,
      title,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const createLessonField = proxyStore.getRootField('createLesson')
        const lessonStudy = createLessonField.getLinkedRecord('study')
        const studyAdvancedAt = lessonStudy.getValue('advancedAt')

        const study = proxyStore.get(studyId)
        study.setValue(studyAdvancedAt, 'advancedAt')
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
