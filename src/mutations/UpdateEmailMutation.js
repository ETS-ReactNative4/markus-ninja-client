import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import {get} from 'utils'

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
        if (type && email) {
          email.setValue(type, 'type')
        }
      },
      updater: proxyStore => {
        const updateEmailField = proxyStore.getRootField('updateEmail')
        if (updateEmailField) {
          const newType = updateEmailField.getValue('type')

          const email = proxyStore.get(emailId)
          email && email.setValue(newType, 'type')
        }
      },
      onCompleted: (response, error) => callback(get(response, "updateEmail"), error),
      onError: err => callback(null, err),
    },
  )
}
