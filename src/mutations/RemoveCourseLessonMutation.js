import {
  commitMutation,
  graphql,
} from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation RemoveCourseLessonMutation($input: RemoveCourseLessonInput!) {
    removeCourseLesson(input: $input) {
      course {
        id
        lessonCount
      }
      removedLessonId
    }
  }
`

export default (lessonId, callback) => {
  const variables = {
    input: {
      lessonId,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const removeCourseLessonField = proxyStore.getRootField('removeCourseLesson')
        if (!isNil(removeCourseLessonField)) {
          const lessonCourse = removeCourseLessonField.getLinkedRecord('course')
          const lessonCourseId = lessonCourse.getValue('id')
          const lessonCount = lessonCourse.getValue('lessonCount')
          const course = proxyStore.get(lessonCourseId)
          course.setValue(lessonCount, 'lessonCount')
          const removedLessonId = removeCourseLessonField.getValue('removedLessonId')
          const lessons = ConnectionHandler.getConnection(course, 'CourseLessons_lessons')
          ConnectionHandler.deleteNode(lessons, removedLessonId)
        }
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
