import { ConnectionHandler } from 'relay-runtime'
import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { get, isNil, nullString } from 'utils'

const mutation = graphql`
  mutation CreateUserAssetMutation($input: CreateUserAssetInput!) {
    createUserAsset(input: $input) {
      userAssetEdge {
        node {
          href
          name
          ...UserAssetPreview_asset
        }
      }
      study {
        assetCount
      }
    }
  }
`

export default (assetId, studyId, name, callback) => {
  const variables = {
    input: {
      assetId,
      studyId: nullString(studyId),
      name: nullString(name),
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
          const studyAssetCount = userAssetStudy.getValue('assetCount')
          const study = proxyStore.get(studyId)
          study.setValue(studyAssetCount, 'assetCount')

          const userAssetEdge = createUserAssetField.getLinkedRecord('userAssetEdge')
          const studyAssets = ConnectionHandler.getConnection(
            study,
            "StudyAssets_assets",
          )
          studyAssets && ConnectionHandler.insertEdgeBefore(studyAssets, userAssetEdge)
        }
      },
      onCompleted: (response, error) => {
        const userAsset = get(response, "createUserAsset.userAssetEdge.node")
        callback(userAsset, error)
      },
      onError: err => console.error(err),
    },
  )
}
