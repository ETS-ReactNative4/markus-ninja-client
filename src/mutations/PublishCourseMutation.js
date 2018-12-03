import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import {nullString} from 'utils'

const mutation = graphql`
  mutation PublishCourseMutation($input: PublishCourseInput!) {
    publishCourse(input: $input) {
      id
      isPublished
      publishedAt
      updatedAt
    }
  }
`

export default (courseId, callback) => {
  const variables = {
    input: {
      courseId: nullString(courseId),
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const publishCourseField = proxyStore.getRootField('publishCourse')
        if (publishCourseField) {
          const newIsPublished = publishCourseField.getValue('isPublished')
          const newPublishedAt = publishCourseField.getValue('publishedAt')
          const newUpdatedAt = publishCourseField.getValue('updatedAt')

          const course = proxyStore.get(courseId)
          if (course) {
            course.setValue(newIsPublished, 'isPublished')
            course.setValue(newPublishedAt, 'publishedAt')
            course.setValue(newUpdatedAt, 'updatedAt')
          }
        }
      },
      onCompleted: (response, error) => {
        callback(response.publishCourse, error)
      },
      onError: err => callback(null, err),
    },
  )
}
