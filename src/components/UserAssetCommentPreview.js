// import React, { Component } from 'react'
// import {
//   createFragmentContainer,
//   graphql,
// } from 'react-relay'
// import { Link } from 'react-router-dom'
// import HTML from 'components/HTML'
// import { get } from 'utils'
//
// class UserAssetCommentPreview extends Component {
//   render() {
//     const comment = get(this.props, "comment", {})
//     return (
//       <Link
//         className="UserAssetCommentPreview"
//         to={comment.resourcePath}
//       >
//         <HTML className="UserAssetCommentPreview__bodyHTML" html={comment.bodyHTML} />
//       </Link>
//     )
//   }
// }
//
// export default createFragmentContainer(UserAssetCommentPreview, graphql`
//   fragment UserAssetCommentPreview_comment on UserAssetComment {
//     id
//     bodyHTML
//     resourcePath
//   }
// `)
