import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { isNil } from 'utils'

const mutation = graphql`
  mutation CreateCourseMutation($input: CreateCourseInput!) {
    createCourse(input: $input) {
      courseEdge {
        node {
          id
          createdAt
          description
          name
          resourcePath
        }
      }
      study {
        id
        courses(first: 0) {
          totalCount
        }
      }
    }
  }
`

export default (studyId, name, description, callback) => {
  const variables = {
    input: {
      studyId,
      description,
      name,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const createCourseField = proxyStore.getRootField('createCourse')
        if (!isNil(createCourseField)) {
          const courseStudy = createCourseField.getLinkedRecord('study')
          const courseStudyId = courseStudy.getValue('id')
          const courseStudyCourses = courseStudy.getLinkedRecord('courses', {first: 0})
          const study = proxyStore.get(courseStudyId)
          study.setLinkedRecord(courseStudyCourses, 'courses', {first: 0})
        }
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}
