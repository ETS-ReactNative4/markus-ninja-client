import { ConnectionHandler } from 'relay-runtime'
import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import { get, isNil, nullString } from 'utils'

const mutation = graphql`
  mutation CreateUserAssetMutation($input: CreateUserAssetInput!) {
    createUserAsset(input: $input) {
      userAssetEdge {
        node {
          href
          name
          ...ListUserAssetPreview_asset
        }
      }
      study {
        assets(first: 0) {
          totalCount
        }
      }
    }
  }
`

export default (assetId, studyId, name, description, callback) => {
  const variables = {
    input: {
      assetId,
      studyId: nullString(studyId),
      name: nullString(name),
      description: nullString(description),
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const createUserAssetField = proxyStore.getRootField('createUserAsset')
        if (!isNil(createUserAssetField)) {
          const userAssetStudy = createUserAssetField.getLinkedRecord('study')
          const studyAssetCount = userAssetStudy &&
            userAssetStudy.getLinkedRecord('assets', {first: 0})
          const study = proxyStore.get(studyId)
          if (study) {
            study.setLinkedRecord(studyAssetCount, 'assets', {first: 0})

            const userAssetEdge = createUserAssetField.getLinkedRecord('userAssetEdge')
            const studyAssets = ConnectionHandler.getConnection(
              study,
              "StudyAssetsContainer_assets",
            )
            studyAssets && ConnectionHandler.insertEdgeBefore(studyAssets, userAssetEdge)
          }
        }
      },
      onCompleted: (response, error) => {
        const userAsset = get(response, "createUserAsset.userAssetEdge.node")
        callback(userAsset, error)
      },
      onError: err => callback(null, err),
    },
  )
}
