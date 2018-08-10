// import React, { Component } from 'react'
// import {
//   createFragmentContainer,
//   graphql,
// } from 'react-relay'
// import moment from 'moment'
// import HTML from 'components/HTML'
// import RichTextEditor from 'components/RichTextEditor'
// import DeleteUserAssetCommentMutation from 'mutations/DeleteUserAssetCommentMutation'
// import UpdateUserAssetCommentMutation from 'mutations/UpdateUserAssetCommentMutation'
// import { get, isNil } from 'utils'
//
// class UserAssetComment extends Component {
//   state = {
//     edit: false,
//     error: null,
//     body: get(this.props, "comment.body", ""),
//   }
//
//   render() {
//     const comment = get(this.props, "comment", {})
//     const { edit, error, body } = this.state
//     if (!edit) {
//       return (
//         <div
//           id={`user_asset_comment${moment(comment.createdAt).unix()}`}
//           className="UserAssetComment"
//         >
//           <ul>
//             {comment.viewerDidAuthor &&
//             <li>
//               <span>Author</span>
//             </li>}
//             {comment.viewerCanDelete &&
//             <li>
//               <button className="btn" type="button" onClick={this.handleDelete}>
//                 Delete
//               </button>
//             </li>}
//           </ul>
//           <HTML className="UserAssetComment__bodyHTML" html={comment.bodyHTML} />
//           {comment.viewerCanUpdate &&
//           <button
//             className="UserAssetComment__edit"
//             onClick={this.handleToggleEdit}
//           >
//             Edit
//           </button>}
//         </div>
//       )
//     } else if (comment.viewerCanUpdate) {
//       return (
//         <form onSubmit={this.handleSubmit}>
//           <RichTextEditor
//             id="UserAssetComment__body"
//             onChange={this.handleChange}
//             placeholder="Leave a comment"
//             initialValue={body}
//           />
//           <button type="submit">Update comment</button>
//           <button onClick={this.handleToggleEdit}>Cancel</button>
//           <span>{error}</span>
//         </form>
//       )
//     }
//     return null
//   }
//
//   handleChange = (body) => {
//     this.setState({body})
//   }
//
//   handleDelete = () => {
//     DeleteUserAssetCommentMutation(
//       this.props.comment.id,
//     )
//   }
//
//   handleSubmit = (e) => {
//     e.preventDefault()
//     const { body } = this.state
//     UpdateUserAssetCommentMutation(
//       this.props.comment.id,
//       body,
//       (error) => {
//         if (!isNil(error)) {
//           this.setState({ error: error.message })
//         }
//         this.handleToggleEdit()
//       },
//     )
//   }
//
//   handleToggleEdit = () => {
//     this.setState({ edit: !this.state.edit })
//   }
// }
//
// export default createFragmentContainer(UserAssetComment, graphql`
//   fragment UserAssetComment_comment on UserAssetComment {
//     id
//     createdAt
//     body
//     bodyHTML
//     publishedAt
//     updatedAt
//     viewerCanDelete
//     viewerCanUpdate
//     viewerDidAuthor
//   }
// `)
