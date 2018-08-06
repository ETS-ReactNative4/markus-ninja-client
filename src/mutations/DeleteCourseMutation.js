import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation DeleteCourseMutation($input: DeleteCourseInput!) {
    deleteCourse(input: $input) {
      deletedCourseId
      study {
        id
        courses(first: 0) {
          totalCount
        }
      }
    }
  }
`

export default (courseId, callback) => {
  const variables = {
    input: {
      courseId,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const deleteCourseField = proxyStore.getRootField('deleteCourse')
        if (!isNil(deleteCourseField)) {
          const deletedCourseId = deleteCourseField.getValue('deletedCourseId')
          const courseStudy = deleteCourseField.getLinkedRecord('study')
          const courseStudyId = courseStudy.getValue('id')
          const courseStudyCourses = courseStudy.getLinkedRecord('courses', {first: 0})
          const study = proxyStore.get(courseStudyId)
          study.setLinkedRecord(courseStudyCourses, 'courses', {first: 0})

          proxyStore.delete(deletedCourseId)
        }
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
