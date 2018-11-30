import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { ConnectionHandler } from 'relay-runtime'
import environment from 'Environment'
import { get } from 'utils'

const mutation = graphql`
  mutation AddEmailMutation($input: AddEmailInput!) {
    addEmail(input: $input) {
      emailEdge {
        node {
          id
          ...ViewerEmail_email
        }
      }
      token {
        issuedAt
        expiresAt
      }
      user {
        id
      }
    }
  }
`

export default (email, callback) => {
  const variables = {
    input: {
      email,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const addEmailField = proxyStore.getRootField("addEmail")
        if (addEmailField) {
          const emailUser = addEmailField.getLinkedRecord("user")
          const userId = emailUser && emailUser.getValue("id")
          const user = proxyStore.get(userId)
          if (user) {
            const emails = ConnectionHandler.getConnection(
              user,
              "ViewerEmailList_allEmails",
            )
            const edge = addEmailField.getLinkedRecord("emailEdge")
            if (edge) {
              ConnectionHandler.insertEdgeAfter(emails, edge)
            }
          }
        }
      },
      onCompleted: (response, error) => {
        const email = get(response, "addEmail.emailEdge.node")
        callback(email, error)
      },
      onError: err => callback(null, err),
    },
  )
}
