import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { isNil } from 'utils'

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
      optimisticUpdater: proxyStore => {
        const study = proxyStore.get(studyId)
        if (!isNil(description)) {
          study.setValue(description, 'description')
        }
      },
      updater: proxyStore => {
        const updateStudyField = proxyStore.getRootField('updateStudy')
        const newDescription = updateStudyField.getValue('description')
        const newName = updateStudyField.getValue('name')
        const newNameWithOwner = updateStudyField.getValue('nameWithOwner')
        const newResourcePath = updateStudyField.getValue('resourcePath')
        const newUrl = updateStudyField.getValue('url')
        const newUpdatedAt = updateStudyField.getValue('updatedAt')

        const study = proxyStore.get(studyId)
        study.setValue(newDescription, 'description')
        study.setValue(newName, 'name')
        study.setValue(newNameWithOwner, 'nameWithOwner')
        study.setValue(newResourcePath, 'resourcePath')
        study.setValue(newUrl, 'url')
        study.setValue(newUpdatedAt, 'updatedAt')
      },
      onCompleted: (response, error) => {
        callback(error)
      },
      onError: err => console.error(err),
    },
  )
}
