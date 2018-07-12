import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'

const mutation = graphql`
  mutation CreateStudyMutation($input: CreateStudyInput!) {
    createStudy(input: $input) {
      id
      createdAt
      description
      name
      resourcePath
    }
  }
`

export default (name, description, callback) => {
  const variables = {
    input: {
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
