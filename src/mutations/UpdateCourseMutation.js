import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'

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
      onCompleted: (response, error) => {
        callback(response.updateCourse, error)
      },
      onError: err => callback(null, err),
    },
  )
}
