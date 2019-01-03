import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import {nullString} from 'utils'

const mutation = graphql`
  mutation UpdateLessonMutation($input: UpdateLessonInput!) {
    updateLesson(input: $input) {
      id
      draft
      lastEditedAt
      title
      updatedAt
    }
  }
`

export default (lessonId, title, draft, callback) => {
  const variables = {
    input: {
      draft,
      lessonId: nullString(lessonId),
      title: nullString(title),
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      onCompleted: (response, error) => {
        callback(response.updateLesson, error)
      },
      onError: err => callback(null, err),
    },
  )
}
