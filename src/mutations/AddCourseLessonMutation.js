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
          ...CourseLessonPreview_lesson
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
          const course = proxyStore.get(courseId)
          const lessons = ConnectionHandler.getConnection(
            course,
            "CourseLessons_lessons",
          )
          const edge = addCourseLessonField.getLinkedRecord("lessonEdge")

          ConnectionHandler.insertEdgeAfter(lessons, edge)
        }
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
