// import {
//   commitMutation,
//   graphql,
// } from 'react-relay'
// import { ConnectionHandler } from 'relay-runtime'
// import environment from 'Environment'
// import { get, isNil } from 'utils'
//
// const mutation = graphql`
//   mutation AddUserAssetCommentMutation($input: AddUserAssetCommentInput!) {
//     addUserAssetComment(input: $input) {
//       userAssetTimelineEdge {
//         node {
//           __typename
//           id
//           ...on CommentedEvent {
//             ...CommentedEvent_event
//           }
//           ...on ReferencedEvent {
//             ...ReferencedEvent_event
//           }
//         }
//       }
//     }
//   }
// `
//
// export default (userAssetId, body, callback) => {
//   const variables = {
//     input: {
//       body,
//       userAssetId,
//     },
//   }
//
//   commitMutation(
//     environment,
//     {
//       mutation,
//       variables,
//       updater: proxyStore => {
//         const addUserAssetCommentField = proxyStore.getRootField("addUserAssetComment")
//         if (!isNil(addUserAssetCommentField)) {
//           const userAsset = proxyStore.get(userAssetId)
//           const timeline = ConnectionHandler.getConnection(
//             userAsset,
//             "UserAssetTimeline_timeline",
//           )
//           const edge = addUserAssetCommentField.getLinkedRecord("userAssetTimelineEdge")
//
//           ConnectionHandler.insertEdgeBefore(timeline, edge)
//         }
//       },
//       onCompleted: (response, error) => {
//         const userAssetComment = get(response, "addUserAssetComment.userAssetCommentEdge.node")
//         callback(userAssetComment, error)
//       },
//       onError: err => console.error(err),
//     },
//   )
// }
