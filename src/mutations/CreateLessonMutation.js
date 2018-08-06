import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation CreateLessonMutation($input: CreateLessonInput!) {
    createLesson(input: $input) {
      lessonEdge {
        node {
          id
          body
          createdAt
          number
          resourcePath
          title
          course {
            lessonCount
          }
        }
      }
      study {
        id
        advancedAt
      }
    }
  }
`

export default (studyId, title, body, courseId, callback) => {
  const variables = {
    input: {
      body,
      courseId,
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

        if (!isNil(courseId)) {
          const lessonEdge = createLessonField.getLinkedRecord('lessonEdge')
          const lessonCount = lessonEdge
            .getLinkedRecord('node')
            .getLinkedRecord('course')
            .getValue('lessonCount')
          const course = proxyStore.get(courseId)
          course.setValue(lessonCount, 'lessonCount')
        }
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
