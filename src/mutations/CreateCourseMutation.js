import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { get, isNil } from 'utils'

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
        courseCount
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
          const studyCourseCount = courseStudy.getValue('courseCount')
          const study = proxyStore.get(courseStudyId)
          study.setValue(studyCourseCount, 'courseCount')
        }
      },
      onCompleted: (response, error) => {
        callback(get(response, "createCourse.courseEdge.node"), error)
      },
      onError: err => console.error(err),
    },
  )
}
