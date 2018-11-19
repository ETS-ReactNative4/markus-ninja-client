import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import {get} from 'utils'

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
        if (createCourseField) {
          const courseStudy = createCourseField.getLinkedRecord('study')
          if (courseStudy) {
            const courseStudyId = courseStudy.getValue('id')
            const studyCourseCount = courseStudy.getLinkedRecord('courses', {first: 0})
            const study = proxyStore.get(courseStudyId)
            study && study.setLinkedRecord(studyCourseCount, 'courses', {first: 0})
          }
        }
      },
      onCompleted: (response, error) => {
        callback(get(response, "createCourse.courseEdge.node"), error)
      },
      onError: err => callback(null, err),
    },
  )
}
