import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation UpdateLessonCommentMutation($input: UpdateLessonCommentInput!) {
    updateLessonComment(input: $input) {
      id
      draft
      lastEditedAt
      updatedAt
    }
  }
`

export default (lessonCommentId, draft, callback) => {
  const variables = {
    input: {
      draft,
      lessonCommentId,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      optimisticUpdater: proxyStore => {
        const lessonComment = proxyStore.get(lessonCommentId)
        if (lessonComment && !isNil(draft)) {
          lessonComment.setValue(draft, 'draft')
        }
      },
      updater: proxyStore => {
        const updateLessonCommentField = proxyStore.getRootField('updateLessonComment')
        if (!isNil(updateLessonCommentField)) {
          const newDraft = updateLessonCommentField.getValue('draft')
          const newLastEditedAt = updateLessonCommentField.getValue('lastEditedAt')
          const newUpdatedAt = updateLessonCommentField.getValue('updatedAt')

          const lessonComment = proxyStore.get(lessonCommentId)
          if (lessonComment) {
            lessonComment.setValue(newDraft, 'draft')
            lessonComment.setValue(newLastEditedAt, 'lastEditedAt')
            lessonComment.setValue(newUpdatedAt, 'updatedAt')
          }
        }
      },
      onCompleted: (response, error) => {
        callback(response.updateLessonComment, error)
      },
      onError: err => callback(null, err),
    },
  )
}
