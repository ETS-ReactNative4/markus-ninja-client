import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation UpdateEmailMutation($input: UpdateEmailInput!) {
    updateEmail(input: $input) {
      id
      type
    }
  }
`

export default (emailId, type, callback) => {
  const variables = {
    input: {
      emailId,
      type,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      optimisticUpdater: proxyStore => {
        const email = proxyStore.get(emailId)
        if (!isNil(type)) {
          email.setValue(type, 'type')
        }
      },
      updater: proxyStore => {
        const updateEmailField = proxyStore.getRootField('updateEmail')
        const newType = updateEmailField.getValue('type')

        const email = proxyStore.get(emailId)
        email.setValue(newType, 'type')
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
