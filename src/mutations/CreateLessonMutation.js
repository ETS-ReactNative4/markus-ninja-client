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
            lessonCount
          }
        }
      }
      study {
        id
        advancedAt
        lessonCount
      }
    }
  }
`

export default (studyId, title, body, courseId, callback) => {
  const variables = {
    input: {
      body: nullString(body),
      courseId: nullString(courseId),
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
          const studyLessonCount = lessonStudy.getValue('lessonCount')

          const study = proxyStore.get(studyId)
          study.setValue(studyAdvancedAt, 'advancedAt')
          study.setValue(studyLessonCount, 'lessonCount')

          if (!isNil(courseId)) {
            const lessonEdge = createLessonField.getLinkedRecord('lessonEdge')
            const node = lessonEdge.getLinkedRecord('node')
            const lessonCourse = node && node.getLinkedRecord('course')
            const lessonCount = lessonCourse && lessonCourse.getValue('lessonCount')
            const course = proxyStore.get(courseId)
            course && course.setValue(lessonCount, 'lessonCount')
          }
        }
      },
      onCompleted: (response, error) => {
        const lesson = get(response, "createLesson.lessonEdge.node")
        callback(lesson, error)
      },
      onError: err => console.error(err),
    },
  )
}
