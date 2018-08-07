import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { isNil } from 'utils'
import { TOPICS_PER_PAGE } from 'consts'

const mutation = graphql`
  mutation UpdateTopicsMutation($input: UpdateTopicsInput!, $count: Int!, $after: String) {
    updateTopics(input: $input) {
      invalidTopicNames
      message
      topicable {
        id
        ...on Course {
          ...CourseMetaTopics_course
        }
        ...on Study {
          ...StudyMetaTopics_study
        }
      }
    }
  }
`

export default (topicableId, topicNames, callback) => {
  const variables = {
    count: TOPICS_PER_PAGE,
    input: {
      topicableId,
      topicNames,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      onCompleted: (response, error) => {
        callback(error)
      },
      updater: proxyStore => {
        const updateTopicsField = proxyStore.getRootField("updateTopics")
        if (!isNil(updateTopicsField)) {
          const topicable = proxyStore.get(topicableId)
          const topicableUpdates = updateTopicsField.getLinkedRecord("topicable")
          const topics = topicableUpdates.getLinkedRecord("topics")
          topicable.setValue(topics, "topics")
        }
      },
      onError: err => console.error(err),
    },
  )
}
