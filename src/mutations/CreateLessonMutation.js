import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { get, isNil, nullString } from 'utils'

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
            lessons(first: 0) {
              totalCount
            }
          }
        }
      }
      study {
        id
        advancedAt
        lessons(first: 0) {
          totalCount
        }
      }
    }
  }
`

export default (studyId, title, callback) => {
  const variables = {
    input: {
      studyId: nullString(studyId),
      title: nullString(title),
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const createLessonField = proxyStore.getRootField('createLesson')
        if (!isNil(createLessonField)) {
          const lessonStudy = createLessonField.getLinkedRecord('study')
          const studyAdvancedAt = lessonStudy.getValue('advancedAt')
          const studyLessonCount = lessonStudy.getLinkedRecord('lessons', {first: 0})

          const study = proxyStore.get(studyId)
          if (study) {
            study.setValue(studyAdvancedAt, 'advancedAt')
            study.setLinkedRecord(studyLessonCount, 'lessons', {first: 0})
          }
        }
      },
      onCompleted: (response, error) => {
        const lesson = get(response, "createLesson.lessonEdge.node")
        callback(lesson, error)
      },
      onError: err => callback(null, err),
    },
  )
}
