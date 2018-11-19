import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'

const mutation = graphql`
  mutation AddCourseLessonMutation($input: AddCourseLessonInput!) {
    addCourseLesson(input: $input) {
      lessonEdge {
        cursor
        node {
          ...ListLessonPreview_lesson
          courseNumber
          id
          resourcePath
        }
      }
      course {
        lessons(first: 0) {
          totalCount
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
        const addCourseLessonField = proxyStore.getRootField("addCourseLesson")
        if (addCourseLessonField) {
          const lessonCourse = addCourseLessonField.getLinkedRecord('course')
          const courseLessonCount = lessonCourse &&
            lessonCourse.getLinkedRecord('lessons', {first: 0})
          const course = proxyStore.get(courseId)
          if (course) {
            course.setLinkedRecord(courseLessonCount, 'lessons', {first: 0})
            const courseLessons = ConnectionHandler.getConnection(
              course,
              "CourseLessons_lessons",
            )
            const edge = addCourseLessonField.getLinkedRecord("lessonEdge")
            courseLessons && ConnectionHandler.insertEdgeBefore(courseLessons, edge)
          }
        }
      },
      onCompleted: callback,
      onError: err => callback(null, err),
    },
  )
}
