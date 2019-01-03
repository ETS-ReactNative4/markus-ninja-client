import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'

const mutation = graphql`
  mutation UpdateStudyMutation($input: UpdateStudyInput!) {
    updateStudy(input: $input) {
      id
      description
      name
      nameWithOwner
      resourcePath
      url
      updatedAt
    }
  }
`

export default (studyId, description, name, callback) => {
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
      onCompleted: (response, error) => {
        callback(response.updateStudy, error)
      },
      onError: err => callback(null, err),
    },
  )
}
