import { ConnectionHandler } from 'relay-runtime'
import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'

const mutation = graphql`
  mutation DeleteEmailMutation($input: DeleteEmailInput!) {
    deleteEmail(input: $input) {
      deletedEmailId
      user {
        id
        emails(first: 0) {
          totalCount
        }
      }
    }
  }
`

export default (emailId, callback) => {
  const variables = {
    input: {
      emailId,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const deleteEmailField = proxyStore.getRootField('deleteEmail')
        if (deleteEmailField) {
          const emailUser = deleteEmailField.getLinkedRecord('user')
          if (emailUser) {
            const emailUserId = emailUser.getValue('id')
            const user = proxyStore.get(emailUserId)
            if (user) {
              const userEmails = ConnectionHandler.getConnection(
                user,
                "ViewerEmailList_allEmails",
              )

              const deletedEmailId = deleteEmailField.getValue("deletedEmailId")
              userEmails && ConnectionHandler.deleteNode(userEmails, deletedEmailId)
            }

            proxyStore.delete(emailId)
          }
        }
      },
      onCompleted: callback,
      onError: err => callback(null, err),
    },
  )
}
