import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'

const mutation = graphql`
  mutation MarkAllStudyNotificationsAsReadMutation($input: MarkAllStudyNotificationAsReadInput!) {
    markAllStudyNotificationsAsRead(input: $input)
  }
`

export default (studyId, callback) => {
  const variables = {
    input: {
      studyId,
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
