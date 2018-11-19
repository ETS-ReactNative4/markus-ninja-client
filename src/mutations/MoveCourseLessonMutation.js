import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'

const mutation = graphql`
  mutation MoveCourseLessonMutation($input: MoveCourseLessonInput!) {
    moveCourseLesson(input: $input) {
      lessonEdge {
        node {
          ...ListLessonPreview_lesson
        }
      }
    }
  }
`

export default (courseId, lessonId, afterLessonId, oldCourseNumber, callback) => {
  const variables = {
    input: {
      afterLessonId,
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
        const moveCourseLessonField = proxyStore.getRootField("moveCourseLesson")
        if (moveCourseLessonField) {
          const newLessonEdge = moveCourseLessonField.getLinkedRecord("lessonEdge")
          const newLessonNode = newLessonEdge && newLessonEdge.getLinkedRecord("node")
          const newCourseNumber = newLessonNode && newLessonNode.getValue("courseNumber")
          const moveForward = (newCourseNumber - oldCourseNumber) > 0
          const course = proxyStore.get(courseId)
          if (course) {
            const courseLessons = ConnectionHandler.getConnection(
              course,
              "CourseLessons_lessons",
            )
            if (courseLessons) {
              ConnectionHandler.deleteNode(courseLessons, lessonId)
              let afterCursor
              const edges = courseLessons.getLinkedRecords("edges")
              for (let edge of edges) {
                const node = edge.getLinkedRecord("node")
                if (node) {
                  const id = node.getValue("id")
                  if (id === afterLessonId) {
                    afterCursor = edge.getValue("cursor")
                  }
                  const courseNumber = node.getValue("courseNumber")
                  if (moveForward && courseNumber > oldCourseNumber && courseNumber <= newCourseNumber) {
                    node.setValue(courseNumber-1, "courseNumber")
                  } else if (!moveForward && courseNumber >= newCourseNumber && courseNumber < oldCourseNumber) {
                    node.setValue(courseNumber+1, "courseNumber")
                  }
                }
              }
              ConnectionHandler.insertEdgeAfter(courseLessons, newLessonEdge, afterCursor)
            }
          }
        }
      },
      onCompleted: callback,
      onError: err => callback(null, err),
    },
  )
}
