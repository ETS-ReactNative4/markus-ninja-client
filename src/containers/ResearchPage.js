import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import StudyPreview from 'components/StudyPreview'
import TopicPreview from 'components/TopicPreview'
import { get } from 'utils'

const ResearchPageQuery = graphql`
  query ResearchPageQuery {
    popularStudies: search(first: 6, query: "*", type: STUDY, orderBy:{direction:DESC, field:APPLE_COUNT}) {
      edges {
        node {
          id
          ...on Study {
            ...StudyPreview_study
          }
        }
      }
    }
    popularTopics: search(first: 6, query: "*", type: TOPIC, orderBy:{direction:DESC, field:TOPICED_COUNT}) {
      edges {
        node {
          id
          ...on Topic {
            ...TopicPreview_topic
          }
        }
      }
    }
  }
`

class ResearchPage extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={ResearchPageQuery}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const popularStudyEdges = get(props, "popularStudies.edges", [])
            const popularTopicEdges = get(props, "popularTopics.edges", [])
            return (
              <div>
                <h2>Popular studies</h2>
                {popularStudyEdges.map(({node}) => (
                  <StudyPreview key={node.__id} study={node} />
                ))}
                <h2>Popular topics</h2>
                {popularTopicEdges.map(({node}) => (
                  <TopicPreview key={node.__id} topic={node} />
                ))}
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(ResearchPage)
