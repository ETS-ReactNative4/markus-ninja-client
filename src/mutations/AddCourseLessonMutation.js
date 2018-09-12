import {
  commitMutation,
  graphql,
} from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation AddCourseLessonMutation($input: AddCourseLessonInput!) {
    addCourseLesson(input: $input) {
      lessonEdge {
        node {
          ...LessonPreview_lesson
        }
      }
      course {
        lessonCount
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
        if (!isNil(addCourseLessonField)) {
          const lessonCount = addCourseLessonField
            .getLinkedRecord('course')
            .getValue('lessonCount')
          const course = proxyStore.get(courseId)
          course.setValue(lessonCount, 'lessonCount')
          const courseLessons = ConnectionHandler.getConnection(
            course,
            "CourseLessons_lessons",
          )
          const studyId = course.getLinkedRecord('study').getValue('id')
          const study = proxyStore.get(studyId)
          const studyLessonsSelect = ConnectionHandler.getConnection(
            study,
            "StudyLessonSelect_lessons",
          )
          const edge = addCourseLessonField.getLinkedRecord("lessonEdge")
          courseLessons && ConnectionHandler.insertEdgeAfter(courseLessons, edge)
          studyLessonsSelect && ConnectionHandler.deleteNode(studyLessonsSelect, lessonId)
        }
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
