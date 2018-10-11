import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { get, isNil } from 'utils'
import { TOPICS_PER_PAGE } from 'consts'

const mutation = graphql`
  mutation UpdateTopicsMutation(
    $input: UpdateTopicsInput!,
    $studyTopicCount: Int!,
    $afterStudyTopic: String,
    $courseTopicCount: Int!,
    $afterCourseTopic: String,
  ) {
    updateTopics(input: $input) {
      invalidTopicNames
      message
      topicable {
        id
        ...on Course {
          ...CourseMetaTopics_course @arguments(
            after: $afterCourseTopic
            count: $courseTopicCount
          )
        }
        ...on Study {
          ...StudyMetaTopics_study @arguments(
            after: $afterStudyTopic
            count: $studyTopicCount
          )
        }
      }
    }
  }
`

export default (topicableId, topicNames, callback) => {
  const variables = {
    courseTopicCount: TOPICS_PER_PAGE,
    studyTopicCount: TOPICS_PER_PAGE,
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
        const message = get(response, "updateTopics.message", null)
        const invalidTopicNames = get(response, "updateTopics.invalidTopicNames", null)
        callback(message, invalidTopicNames)
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
