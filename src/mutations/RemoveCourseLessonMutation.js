import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'

const mutation = graphql`
  mutation RemoveCourseLessonMutation($input: RemoveCourseLessonInput!) {
    removeCourseLesson(input: $input) {
      course {
        id
        isPublishable
        lessons(first: 0) {
          totalCount
        }
      }
      removedLessonId
      removedLessonEdge {
        node {
          id
          courseNumber
          number
          title
        }
      }
    }
  }
`

export default (courseId, lessonId, callback) => {
  const variables = {
    input: {
      courseId,
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
        if (removeCourseLessonField) {
          const lessonCourse = removeCourseLessonField.getLinkedRecord('course')
          if (lessonCourse) {
            const lessonCourseId = lessonCourse.getValue('id')
            const courseIsPublishable = lessonCourse.getValue('isPublishable')
            const courseLessonCount = lessonCourse.getLinkedRecord('lessons', {first: 0})
            const course = proxyStore.get(lessonCourseId)
            if (course) {
              course.setValue(courseIsPublishable, 'isPublishable')
              course.setLinkedRecord(courseLessonCount, 'lessons', {first: 0})

              const removedLessonId = removeCourseLessonField.getValue('removedLessonId')
              const courseLessons = ConnectionHandler.getConnection(
                course,
                "CourseLessons_lessons",
              )
              courseLessons && ConnectionHandler.deleteNode(courseLessons, removedLessonId)
            }
          }
        }
      },
      onCompleted: callback,
      onError: err => callback(null, err),
    },
  )
}
