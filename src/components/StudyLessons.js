// import React, { Component } from 'react'
// import cls from 'classnames'
// import {
//   createPaginationContainer,
//   graphql,
// } from 'react-relay'
// import Edge from 'components/Edge'
// import CreateLessonLink from 'components/CreateLessonLink'
// import StudyLabelsLink from 'components/StudyLabelsLink'
// import SearchStudyLessonsInput from 'components/SearchStudyLessonsInput'
// import LessonPreview from './LessonPreview.js'
// import { get, isEmpty } from 'utils'
//
// import { LESSONS_PER_PAGE } from 'consts'
//
// class StudyLessons extends Component {
//   state = {
//     lessonEdges: []
//   }
//
//   _loadMore = () => {
//     const relay = get(this.props, "relay")
//     if (!relay.hasMore()) {
//       console.log("Nothing more to load")
//       return
//     } else if (relay.isLoading()){
//       console.log("Request is already pending")
//       return
//     }
//
//     relay.loadMore(LESSONS_PER_PAGE)
//   }
//
//   get classes() {
//     const {className} = this.props
//     return cls("StudyLessons", className)
//   }
//
//   render() {
//     const study = get(this.props, "study", null)
//     const {lessonEdges} = this.state
//     return (
//       <div className={this.classes}>
//         <SearchStudyLessonsInput
//           className="flex-auto pr4"
//           query={this.props}
//           study={study}
//           onQueryComplete={(lessonEdges) => this.setState({ lessonEdges })}
//         />
//         <StudyLabelsLink study={study}>
//           Labels
//         </StudyLabelsLink>
//         {isEmpty(lessonEdges)
//         ? <CreateLessonLink study={study}>
//             Create a lesson
//           </CreateLessonLink>
//         : <div className="StudyLessons__lessons">
//             {lessonEdges.map((edge) => (
//               <Edge key={get(edge, "node.id", "")} edge={edge} render={({node}) =>
//                 <LessonPreview lesson={node} />}
//               />
//             ))}
//             {this.props.relay.hasMore() &&
//             <button
//               className="StudyLessons__more"
//               onClick={this._loadMore}
//             >
//               More
//             </button>}
//           </div>
//         }
//       </div>
//     )
//   }
// }
//
// export default createPaginationContainer(StudyLessons,
//   {
//     study: graphql`
//       fragment StudyLessons_query on Query
//       @argumentDefinitions(
//         owner: {type: "String!"},
//         name: {type: "String!"},
//         count: {type: "Int!"},
//         after: {type: "String"},
//         query: {type: "String!"},
//         within: {type: "ID!"}
//       ) {
//         ...SearchUserStudiesInput_query @arguments(count: $count, after: $after, query: $query, within: $within)
//         study(owner: $owner, name: $name) @arguments(owner: $owner, name: $name) {
//           ...CreateLessonLink_study
//           ...StudyLabelsLink_study
//           ...SearchStudyLessonsInput_study
//         }
//       }
//     `,
//   },
//   {
//     direction: 'forward',
//     query: graphql`
//       query StudyLessonsForwardQuery
//       @argumentDefinitions(
//         owner: {type: "String!"},
//         name: {type: "String!"},
//         count: {type: "Int!"},
//         after: {type: "String"},
//         query: {type: "String!"},
//         within: {type: "ID!"}
//       ) {
//         ...StudyLessons_query @arguments(
//           owner: $owner,
//           name: $name,
//           count: $count,
//           after: $after,
//           query: $query,
//           within: $within,
//         )
//       }
//     `,
//     getConnectionFromProps(props) {
//       return get(props, "study.lessons")
//     },
//     getFragmentVariables(previousVariables, totalCount) {
//       return {
//         ...previousVariables,
//         count: totalCount,
//       }
//     },
//     getVariables(props, paginationInfo, getFragmentVariables) {
//       return {
//         owner: props.match.params.owner,
//         name: props.match.params.name,
//         count: paginationInfo.count,
//         after: paginationInfo.cursor,
//       }
//     },
//   },
// )
