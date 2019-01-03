import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'

const mutation = graphql`
  mutation DeleteActivityMutation($input: DeleteActivityInput!) {
    deleteActivity(input: $input) {
      deletedActivityId
      study {
        id
        activities(first: 0) {
          totalCount
        }
      }
    }
  }
`

export default (activityId, callback) => {
  const variables = {
    input: {
      activityId,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const deleteActivityField = proxyStore.getRootField('deleteActivity')
        if (deleteActivityField) {
          const deletedActivityId = deleteActivityField.getValue('deletedActivityId')
          const activityStudy = deleteActivityField.getLinkedRecord('study')
          if (activityStudy) {
            const activityStudyId = activityStudy.getValue('id')
            const studyActivityCount = activityStudy.getLinkedRecord('activities', {first: 0})
            const study = proxyStore.get(activityStudyId)
            study && study.setLinkedRecord(studyActivityCount, 'activities', {first: 0})

            proxyStore.delete(deletedActivityId)
          }
        }
      },
      onCompleted: callback,
      onError: err => callback(null, err),
    },
  )
}
