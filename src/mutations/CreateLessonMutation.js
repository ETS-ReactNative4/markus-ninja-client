import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'

const mutation = graphql`
  mutation CreateLessonMutation($input: CreateLessonInput!) {
    createLesson(input: $input) {
      id
      body
      createdAt
      number
      resourcePath
      title
    }
  }
`

export default (studyId, title, body, callback) => {
  const variables = {
    input: {
      body,
      studyId,
      title,
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
