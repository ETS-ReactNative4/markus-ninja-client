import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'

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
        if (deleteCourseField) {
          const deletedCourseId = deleteCourseField.getValue('deletedCourseId')
          const courseStudy = deleteCourseField.getLinkedRecord('study')
          if (courseStudy) {
            const courseStudyId = courseStudy.getValue('id')
            const studyCourseCount = courseStudy.getLinkedRecord('courses', {first: 0})
            const study = proxyStore.get(courseStudyId)
            study && study.setLinkedRecord(studyCourseCount, 'courses', {first: 0})

            proxyStore.delete(deletedCourseId)
          }
        }
      },
      onCompleted: callback,
      onError: err => callback(null, err),
    },
  )
}
