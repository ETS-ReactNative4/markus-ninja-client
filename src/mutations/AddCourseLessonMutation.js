import {
  commitMutation,
  graphql,
} from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'

const mutation = graphql`
  mutation AddCourseLessonMutation($input: AddCourseLessonInput!) {
    addCourseLesson(input: $input) {
      lessonEdge {
        node {
          ...LessonPreview_lesson
        }
      }
      course {
        lessons(first: 0) {
          totalCount
        }
        study {
          id
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
            const studyId = course.getLinkedRecord('study').getValue('id')
            const study = proxyStore.get(studyId)
            if (study) {
              const studyLessonsSelect = ConnectionHandler.getConnection(
                study,
                "StudyLessonSelect_lessons",
              )
              const edge = addCourseLessonField.getLinkedRecord("lessonEdge")
              courseLessons && ConnectionHandler.insertEdgeAfter(courseLessons, edge)
              studyLessonsSelect && ConnectionHandler.deleteNode(studyLessonsSelect, lessonId)
            }
          }
        }
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
