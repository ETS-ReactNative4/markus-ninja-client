import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'

const mutation = graphql`
  mutation CreateCourseMutation($input: CreateCourseInput!) {
    createCourse(input: $input) {
      id
      createdAt
      description
      name
      resourcePath
    }
  }
`

export default (studyId, name, description, callback) => {
  const variables = {
    input: {
      studyId,
      description,
      name,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
