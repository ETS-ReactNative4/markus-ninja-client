import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import {get} from 'utils'

const mutation = graphql`
  mutation CreateActivityMutation($input: CreateActivityInput!) {
    createActivity(input: $input) {
      activityEdge {
        node {
          id
          createdAt
          description
          name
          resourcePath
        }
      }
      study {
        id
        activities(first: 0) {
          totalCount
        }
      }
    }
  }
`

export default (studyId, name, description, callback) => {
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
      updater: proxyStore => {
        const createActivityField = proxyStore.getRootField('createActivity')
        if (createActivityField) {
          const activityStudy = createActivityField.getLinkedRecord('study')
          if (activityStudy) {
            const activityStudyId = activityStudy.getValue('id')
            const studyActivityCount = activityStudy.getLinkedRecord('activities', {first: 0})
            const study = proxyStore.get(activityStudyId)
            study && study.setLinkedRecord(studyActivityCount, 'activities', {first: 0})
          }
        }
      },
      onCompleted: (response, error) => {
        callback(get(response, "createActivity.activityEdge.node"), error)
      },
      onError: err => callback(null, err),
    },
  )
}
