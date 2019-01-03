import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'

const mutation = graphql`
  mutation UpdateLabelMutation($input: UpdateLabelInput!) {
    updateLabel(input: $input) {
      id
      ...ListLabelPreview_label
    }
  }
`

export default (labelId, color, description, callback) => {
  const variables = {
    input: {
      color,
      description,
      labelId,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      onCompleted: callback,
      onError: err => callback(null, err),
    },
  )
}
