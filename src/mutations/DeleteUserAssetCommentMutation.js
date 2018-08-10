// import {
//   commitMutation,
//   graphql,
// } from 'react-relay'
// import { ConnectionHandler } from 'relay-runtime'
// import environment from 'Environment'
// import { isNil } from 'utils'
//
// const mutation = graphql`
//   mutation DeleteUserAssetCommentMutation($input: DeleteUserAssetCommentInput!) {
//     deleteUserAssetComment(input: $input) {
//       deletedUserAssetCommentId
//       deletedUserAssetTimelineEventId
//       userAsset {
//         id
//       }
//     }
//   }
// `
//
// export default (userAssetCommentId, callback) => {
//   const variables = {
//     input: {
//       userAssetCommentId,
//     },
//   }
//
//   commitMutation(
//     environment,
//     {
//       mutation,
//       variables,
//       updater: proxyStore => {
//         const deleteUserAssetCommentField = proxyStore.getRootField('deleteUserAssetComment')
//         if (!isNil(deleteUserAssetCommentField)) {
//           const deletedUserAssetCommentId = deleteUserAssetCommentField.getValue('deletedUserAssetCommentId')
//           const deletedUserAssetTimelineEventId = deleteUserAssetCommentField.getValue('deletedUserAssetTimelineEventId')
//           const userAssetId = deleteUserAssetCommentField.getLinkedRecord('userAsset').getValue('id')
//           const userAsset = proxyStore.get(userAssetId)
//           const timeline = ConnectionHandler.getConnection(userAsset, 'UserAssetTimeline_timeline')
//           ConnectionHandler.deleteNode(timeline, deletedUserAssetTimelineEventId)
//           proxyStore.delete(deletedUserAssetCommentId)
//         }
//       },
//       onCompleted: callback,
//       onError: err => console.error(err),
//     },
//   )
// }
