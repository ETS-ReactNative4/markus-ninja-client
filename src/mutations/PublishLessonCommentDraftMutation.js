import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import {nullString} from 'utils'

const mutation = graphql`
  mutation PublishLessonCommentDraftMutation($input: PublishLessonCommentDraftInput!) {
    publishLessonCommentDraft(input: $input) {
      id
      body
      bodyHTML
      publishedAt
      updatedAt
    }
  }
`

export default (lessonCommentId, callback) => {
  const variables = {
    input: {
      lessonCommentId: nullString(lessonCommentId),
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const publishLessonCommentDraftField = proxyStore.getRootField('publishLessonCommentDraft')
        if (publishLessonCommentDraftField) {
          const newBody = publishLessonCommentDraftField.getValue('body')
          const newBodyHTML = publishLessonCommentDraftField.getValue('bodyHTML')
          const newPublishedAt = publishLessonCommentDraftField.getValue('publishedAt')
          const newUpdatedAt = publishLessonCommentDraftField.getValue('updatedAt')

          const comment = proxyStore.get(lessonCommentId)
          if (comment) {
            comment.setValue(newBody, 'body')
            comment.setValue(newBodyHTML, 'bodyHTML')
            comment.setValue(newPublishedAt, 'publishedAt')
            comment.setValue(newUpdatedAt, 'updatedAt')
          }
        }
      },
      onCompleted: (response, error) => {
        callback(response.publishLessonCommentDraft, error)
      },
      onError: err => callback(null, err),
    },
  )
}
