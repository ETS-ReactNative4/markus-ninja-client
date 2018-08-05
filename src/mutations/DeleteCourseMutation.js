import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'

const mutation = graphql`
  mutation DeleteCourseMutation($input: DeleteCourseInput!) {
    deleteCourse(input: $input) {
      deletedCourseId
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
        const deletedCourseId = deleteCourseField.getValue('deletedCourseId')

        proxyStore.delete(deletedCourseId)
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
