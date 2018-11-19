import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation UpdateCourseMutation($input: UpdateCourseInput!) {
    updateCourse(input: $input) {
      id
      description
      name
      updatedAt
    }
  }
`

export default (courseId, description, name, callback) => {
  const variables = {
    input: {
      courseId,
      description,
      name,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      optimisticUpdater: proxyStore => {
        const course = proxyStore.get(courseId)
        if (!isNil(description)) {
          course.setValue(description, 'description')
        }
      },
      updater: proxyStore => {
        const updateCourseField = proxyStore.getRootField('updateCourse')
        const newDescription = updateCourseField.getValue('description')
        const newName = updateCourseField.getValue('name')
        const newUpdatedAt = updateCourseField.getValue('updatedAt')

        const course = proxyStore.get(courseId)
        course.setValue(newDescription, 'description')
        course.setValue(newName, 'name')
        course.setValue(newUpdatedAt, 'updatedAt')
      },
      onCompleted: (response, error) => {
        callback(response.updateCourse, error)
      },
      onError: err => callback(null, err),
    },
  )
}
