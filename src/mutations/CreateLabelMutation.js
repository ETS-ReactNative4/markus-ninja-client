import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation CreateLabelMutation($input: CreateLabelInput!) {
    createLabel(input: $input) {
      labelEdge {
        node {
          id
          color
          name
        }
      }
    }
  }
`

export default (studyId, name, description, color, callback) => {
  const variables = {
    input: {
      color,
      description,
      name,
      studyId,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const createLabelField = proxyStore.getRootField('createLabel')
        if (!isNil(createLabelField)) {
        }
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
