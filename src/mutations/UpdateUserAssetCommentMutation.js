// import {
//   commitMutation,
//   graphql,
// } from 'react-relay'
// import environment from 'Environment'
// import { isNil } from 'utils'
//
// const mutation = graphql`
//   mutation UpdateUserAssetCommentMutation($input: UpdateUserAssetCommentInput!) {
//     updateUserAssetComment(input: $input) {
//       id
//       body
//       bodyHTML
//       updatedAt
//     }
//   }
// `
//
// export default (userAssetCommentId, body, callback) => {
//   const variables = {
//     input: {
//       body,
//       userAssetCommentId,
//     },
//   }
//
//   commitMutation(
//     environment,
//     {
//       mutation,
//       variables,
//       optimisticUpdater: proxyStore => {
//         const userAssetComment = proxyStore.get(userAssetCommentId)
//         if (!isNil(body)) {
//           userAssetComment.setValue(body, 'body')
//         }
//       },
//       updater: proxyStore => {
//         const updateUserAssetCommentField = proxyStore.getRootField('updateUserAssetComment')
//         if (!isNil(updateUserAssetCommentField)) {
//           const newBody = updateUserAssetCommentField.getValue('body')
//           const newBodyHTML = updateUserAssetCommentField.getValue('bodyHTML')
//           const newUpdatedAt = updateUserAssetCommentField.getValue('updatedAt')
//
//           const userAssetComment = proxyStore.get(userAssetCommentId)
//           userAssetComment.setValue(newBody, 'body')
//           userAssetComment.setValue(newBodyHTML, 'bodyHTML')
//           userAssetComment.setValue(newUpdatedAt, 'updatedAt')
//         }
//       },
//       onCompleted: callback,
//       onError: err => console.error(err),
//     },
//   )
// }
